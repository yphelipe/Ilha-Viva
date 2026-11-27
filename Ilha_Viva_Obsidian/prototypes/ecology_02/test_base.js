const E=require('./ecology.js'),assert=require('node:assert/strict');let tests=[];function test(n,f){f();tests.push(n)}function run(s,n){for(let i=0;i<n;i++)E.tick(s);return s}function avg(s,k){return E.metrics(s)[k]}
test('determinismo 90 dias',()=>assert.deepEqual(run(E.create(42),360),run(E.create(42),360)));
test('365 dias: balanços e estados finitos em cinco regimes',()=>{for(let w of ['auto','drought','storm','rain','clear']){let s=E.create();s.weather=w;for(let i=0;i<1460;i++){E.tick(s);for(let e of Object.values(s.last))assert.ok(Math.abs(e)<1e-7);for(let c of s.cells)for(let k of ['water','surface','b','res','n','pn','litter','ln','micro'])assert.ok(Number.isFinite(c[k])&&c[k]>=-1e-12)}}});
test('escuro: fotossíntese zero e reserva consumida',()=>{let s=E.create();s.light='dark';let b=E.totals(s).c;run(s,32);assert.equal(avg(s,'photo'),0);assert.ok(E.totals(s).c<b)});
test('seca reduz água e crescimento relativo',()=>{let a=E.create(),b=E.create();a.weather='drought';b.weather='rain';run(a,160);run(b,160);assert.ok(avg(a,'water')<avg(b,'water'));assert.ok(avg(a,'biomass')<avg(b,'biomass'))});
test('tempestade aumenta vazão e alagamentos',()=>{let a=E.create(),b=E.create();a.weather='storm';b.weather='clear';run(a,80);run(b,80);assert.ok(avg(a,'river')>avg(b,'river'));assert.ok(avg(a,'flood')>avg(b,'flood'))});
test('corte transfere carbono e N para resíduo',()=>{let s=E.create(),a=E.totals(s);assert.ok(E.edit(s,0,'cut'));let b=E.totals(s);assert.ok(Math.abs(a.c-b.c)<1e-9&&Math.abs(a.n-b.n)<1e-9)});
test('composto tem entradas explícitas',()=>{let s=E.create(),a=E.totals(s);E.edit(s,0,'compost');let b=E.totals(s);assert.ok(Math.abs(b.c-a.c-.2)<1e-9&&Math.abs(b.n-a.n-.02)<1e-9)});
test('solo saturado reduz oxigenação',()=>{let s=E.create();s.weather='storm';run(s,80);assert.ok(s.cells.some(c=>!c.channel&&c.oxygen<.5))});
test('snapshot JSON continua idêntico',()=>{let s=run(E.create(),64),t=JSON.parse(JSON.stringify(s));assert.deepEqual(run(s,64),run(t,64))});
test('sem regeneração espontânea em célula sem biomassa',()=>{let s=E.create();let c=s.cells[0];c.b=c.res=c.leaf=0;run(s,16);assert.equal(c.b,0)});
console.log(JSON.stringify({passed:tests.length,tests},null,2));
