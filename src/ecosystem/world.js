const World = (() => {
  const epsilon = 1e-9;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const wetCell = cell => !!cell?.channel && cell.surface > 1;

  function footprintBounds({x, y, rx, ry}) {
    return {x:x-rx, y:y-ry, width:rx*2, height:ry*2};
  }

  function compareDepth(a, b) {
    const plane = Number(a.layer === 'overhead') - Number(b.layer === 'overhead');
    const depth = (a.baseY ?? a.y) - (b.baseY ?? b.y);
    const order = (a.depthOrder ?? 0) - (b.depthOrder ?? 0);
    const x = (a.x ?? 0) - (b.x ?? 0);
    if (plane || depth || order || x) return plane || depth || order || x;
    const idA = a.id ?? '', idB = b.id ?? '';
    const numberA = typeof idA === 'number', numberB = typeof idB === 'number';
    if (numberA && numberB) return idA-idB;
    if (numberA !== numberB) return numberA ? -1 : 1;
    return idA < idB ? -1 : Number(idA > idB);
  }

  function intersects(a, b) {
    return a.x <= b.x+b.width && a.x+a.width >= b.x && a.y <= b.y+b.height && a.y+a.height >= b.y;
  }

  function orientation(a, b, x, y) {
    return (b.x-a.x)*(y-a.y) - (b.y-a.y)*(x-a.x);
  }

  function waterEdge(a, b) {
    const t = a.level/(a.level-b.level);
    return {x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t};
  }

  function clipWet(points) {
    const polygon = [];
    for (let i=0; i<points.length; i++) {
      const a = points[i], b = points[(i+1)%points.length];
      if (a.level > 0) polygon.push({x:a.x, y:a.y});
      if ((a.level > 0) !== (b.level > 0)) polygon.push(waterEdge(a,b));
    }
    return polygon;
  }

  function contact(t, nx, ny) {
    const len = Math.hypot(nx, ny);
    return {t, nx:nx/len, ny:ny/len};
  }

  function hitEllipse(x, y, dx, dy, rx, ry) {
    const px=x/rx, py=y/ry, sx=dx/rx, sy=dy/ry;
    const a=sx*sx+sy*sy, b=px*sx+py*sy, c=px*px+py*py-1;
    if (c < -epsilon) {
      return b < -epsilon ? contact(0, px/rx, py/ry) : null;
    }
    const discriminant = b*b-a*c;
    if (b >= 0 || discriminant <= 0 || a === 0) return null;
    // This form avoids subtracting two nearly equal roots near the boundary.
    const t = Math.max(0, c/(-b+Math.sqrt(discriminant)));
    return t < 1-epsilon ? contact(t, (px+sx*t)/rx, (py+sy*t)/ry) : null;
  }

  function boxSlab(position, delta, extent) {
    if (delta === 0) {
      return Math.abs(position) < extent-epsilon ? {enter:-Infinity, exit:Infinity, normal:0} : null;
    }
    const sign = Math.sign(delta);
    return {enter:(-sign*extent-position)/delta, exit:(sign*extent-position)/delta, normal:-sign};
  }

  function hitBox(x, y, dx, dy, rx, ry) {
    const gapX = rx-Math.abs(x), gapY = ry-Math.abs(y);
    if (gapX > epsilon && gapY > epsilon) {
      const nx = Math.sign(x || dx), ny = Math.sign(y || dy);
      const escapeX = gapX <= gapY && dx*nx >= 0;
      const escapeY = gapY <= gapX && dy*ny >= 0;
      if (escapeX || escapeY) return null;
      return gapX <= gapY ? {t:0,nx,ny:0} : {t:0,nx:0,ny};
    }
    const h = boxSlab(x, dx, rx), v = boxSlab(y, dy, ry);
    if (!h || !v) return null;
    const enter = Math.max(h.enter, v.enter, 0), exit = Math.min(h.exit, v.exit, 1);
    if (enter >= exit-epsilon) return null;
    return h.enter >= v.enter ? {t:enter,nx:h.normal,ny:0} : {t:enter,nx:0,ny:v.normal};
  }

  function create({width, height, cellWidth, cellHeight, sectorSize=5}) {
    const worldWidth=width*cellWidth, worldHeight=height*cellHeight;
    const sectorWidth=sectorSize*cellWidth, sectorHeight=sectorSize*cellHeight;
    const sectorCols=Math.ceil(width/sectorSize), sectorRows=Math.ceil(height/sectorSize);
    const worldBounds={x:0,y:0,width:worldWidth,height:worldHeight};

    function keysIn(rect, padding, unitWidth, unitHeight, columns, rows) {
      const area={x:rect.x-padding,y:rect.y-padding,width:rect.width+2*padding,height:rect.height+2*padding};
      if (!intersects(area, worldBounds)) return [];
      const x0=clamp(Math.floor(area.x/unitWidth),0,columns-1);
      const y0=clamp(Math.floor(area.y/unitHeight),0,rows-1);
      const x1=clamp(Math.floor((area.x+area.width)/unitWidth),0,columns-1);
      const y1=clamp(Math.floor((area.y+area.height)/unitHeight),0,rows-1);
      const keys=[];
      for (let y=y0;y<=y1;y++) for (let x=x0;x<=x1;x++) keys.push(y*columns+x);
      return keys;
    }

    function sectorsFor(rect, padding=0) {
      return keysIn(rect,padding,sectorWidth,sectorHeight,sectorCols,sectorRows);
    }

    function sectorAt(x,y) {
      if (x<0 || y<0 || x>=worldWidth || y>=worldHeight) return null;
      return Math.floor(y/sectorHeight)*sectorCols+Math.floor(x/sectorWidth);
    }

    function cellsFor(rect, padding=0) {
      return keysIn(rect,padding,cellWidth,cellHeight,width,height);
    }

    function createIndex() {
      const entries = new Map(), buckets = new Map();
      let nextOrder = 0;
      function remove(entry) {
        for (const key of entry.keys) {
          const bucket = buckets.get(key);
          bucket.delete(entry);
          if (!bucket.size) buckets.delete(key);
        }
      }
      return {
        set(id, bounds, value) {
          let entry = entries.get(id);
          if (entry && entry.bounds.x === bounds.x && entry.bounds.y === bounds.y &&
            entry.bounds.width === bounds.width && entry.bounds.height === bounds.height) {
            entry.value = value;
            return;
          }
          if (entry) remove(entry);
          else entry = {order:nextOrder++};
          entry.bounds = {...bounds};
          entry.value = value;
          entry.keys = sectorsFor(bounds);
          entries.set(id,entry);
          for (const key of entry.keys) {
            if (!buckets.has(key)) buckets.set(key,new Set());
            buckets.get(key).add(entry);
          }
        },
        delete(id) {
          const entry = entries.get(id);
          if (!entry) return false;
          remove(entry);
          return entries.delete(id);
        },
        clear() {
          entries.clear();
          buckets.clear();
          nextOrder = 0;
        },
        get(id) { return entries.get(id)?.value; },
        get size() { return entries.size; },
        query(rect) {
          const matches = new Set();
          for (const key of sectorsFor(rect)) {
            for (const entry of buckets.get(key) || []) {
              if (intersects(entry.bounds,rect)) matches.add(entry);
            }
          }
          return [...matches].sort((a,b)=>a.order-b.order).map(entry=>entry.value);
        },
      };
    }

    // A signed water field sampled at the original cell centers. The same
    // triangles determine both the visible shoreline and the controls.
    function corner(cells, x, y, isWater) {
      const ix = clamp(x,0,width-1), iy = clamp(y,0,height-1);
      const cell = cells[iy*width+ix];
      const variation = ((Math.imul(ix+11,334214467) ^ Math.imul(iy+21,178632487)) >>> 0)%31/100;
      return {x:(x+.5)*cellWidth,y:(y+.5)*cellHeight,cell,level:(isWater(cell) ? 1 : -1)*(.85+variation)};
    }

    function corners(cells, x, y, isWater) {
      return [corner(cells,x,y,isWater),corner(cells,x+1,y,isWater),
        corner(cells,x+1,y+1,isWater),corner(cells,x,y+1,isWater)];
    }

    function center(points) {
      const [a,b,c,d] = points;
      return {x:(a.x+c.x)/2,y:(a.y+c.y)/2,level:(a.level+b.level+c.level+d.level)/4};
    }

    function waterAt(cells, x, y, isWater=wetCell) {
      if (x<0 || y<0 || x>=worldWidth || y>=worldHeight) return null;
      const gridX=Math.floor(x/cellWidth-.5), gridY=Math.floor(y/cellHeight-.5);
      const points = corners(cells,gridX,gridY,isWater);
      let closest = null, distance = Infinity, wet = 0;
      for (const p of points) {
        if (p.level <= 0) continue;
        wet++;
        const d = ((p.x-x)/cellWidth)**2+((p.y-y)/cellHeight)**2;
        if (d < distance) { distance=d; closest=p.cell; }
      }
      if (wet === 0 || wet === 4) return closest;
      const m = center(points);
      for (let i=0;i<4;i++) {
        const a=points[i], b=points[(i+1)%4];
        const wa=orientation(b,m,x,y), wb=orientation(m,a,x,y), wm=orientation(a,b,x,y);
        if (wa < -epsilon || wb < -epsilon || wm < -epsilon) continue;
        return wa*a.level+wb*b.level+wm*m.level > 0 ? closest : null;
      }
      return null;
    }

    function waterPolygons(cells, x, y, isWater=wetCell) {
      const points = corners(cells,x,y,isWater);
      const wet = points.filter(p=>p.level>0).length;
      if (!wet) return [];
      if (wet === 4) return [points.map(({x,y})=>({x,y}))];
      const m = center(points), polygons = [];
      for (let i=0;i<4;i++) {
        const polygon = clipWet([points[i],points[(i+1)%4],m]);
        if (polygon.length >= 3) polygons.push(polygon);
      }
      return polygons;
    }

    function firstContact(x, y, dx, dy, index, radiusX, radiusY) {
      const bounds = {x:Math.min(x,x+dx)-radiusX,y:Math.min(y,y+dy)-radiusY,
        width:Math.abs(dx)+2*radiusX,height:Math.abs(dy)+2*radiusY};
      let first = null;
      for (const shape of index.query(bounds)) {
        const hit = shape.shape === 'box' ? hitBox : hitEllipse;
        const point = hit(x-shape.x,y-shape.y,dx,dy,shape.rx+radiusX,shape.ry+radiusY);
        if (point && (!first || point.t < first.t)) first = point;
      }
      return first;
    }

    function blocked(x,y,ox,oy,index,{radiusX=0,radiusY=0}={}) {
      return !!firstContact(ox,oy,x-ox,y-oy,index,radiusX,radiusY);
    }

    function move(x,y,dx,dy,index,{radiusX=0,radiusY=0,inset=5}={}) {
      const marginX = Math.min(Math.max(inset,radiusX),worldWidth/2);
      const marginY = Math.min(Math.max(inset,radiusY),worldHeight/2);
      x = clamp(x,marginX,worldWidth-marginX);
      y = clamp(y,marginY,worldHeight-marginY);
      // Project the remaining displacement onto each contact tangent. A cap
      // bounds work when several footprints meet at the same point.
      for (let i=0;i<4;i++) {
        dx=clamp(x+dx,marginX,worldWidth-marginX)-x;
        dy=clamp(y+dy,marginY,worldHeight-marginY)-y;
        if (Math.hypot(dx,dy) <= epsilon) break;
        const hit=firstContact(x,y,dx,dy,index,radiusX,radiusY);
        if (!hit) return {x:x+dx,y:y+dy};
        x+=dx*hit.t;
        y+=dy*hit.t;
        dx*=1-hit.t;
        dy*=1-hit.t;
        const inward=Math.min(0,dx*hit.nx+dy*hit.ny);
        dx-=inward*hit.nx;
        dy-=inward*hit.ny;
      }
      return {x,y};
    }

    return {waterAt,waterPolygons,createIndex,sectorAt,sectorsFor,cellsFor,move,blocked};
  }

  return {create,footprintBounds,compareDepth};
})();
if (typeof module !== 'undefined' && module.exports) module.exports=World;
