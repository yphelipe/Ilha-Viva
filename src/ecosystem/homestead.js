/* v0.48: placed objects, crafting and player-side material stocks. */
const Homestead = (() => {
    const inventory = typeof module !== 'undefined' ? require('./farm') : Farm;
    const storageCapacity = 18;
    const stoneReserve = 2;
    const woodCarbon = .035;
    const waterVolume = 4;
    const backpackOnly = new Set(['organic', 'compost', 'irrigation']);

    const objects = {
        chest: {name: 'Baú', footprint: {x: .22, y: .34, width: .56, height: .38}},
        fence: {name: 'Cerca', footprint: {x: .03, y: .41, width: .94, height: .18}},
        cookfire: {name: 'Fogareiro', footprint: {x: .22, y: .25, width: .56, height: .50}},
    };
    const recipes = {
        mallet: {name: 'Malho de madeira', inputs: {wood: 2}, output: {item: 'mallet', quantity: 1}},
        chest: {name: 'Baú', inputs: {wood: 3}, output: {item: 'chest', quantity: 1}},
        fence: {name: 'Cerca', inputs: {wood: 1}, output: {item: 'fence', quantity: 1}},
        cookfire: {name: 'Fogareiro', inputs: {wood: 2, stone: 4}, output: {item: 'cookfire', quantity: 1}},
        treat_water: {name: 'Tratar água', inputs: {raw_water: 1}, output: {item: 'water', quantity: 1}, station: 'cookfire'},
        cook_sweet: {name: 'Cozinhar batata-doce', inputs: {sweet: 2, water: 1}, output: {item: 'meal', quantity: 1}, station: 'cookfire'},
        cook_beans: {name: 'Cozinhar feijão', inputs: {beans: 2, water: 1}, output: {item: 'meal', quantity: 1}, station: 'cookfire'},
        cook_rice: {name: 'Cozinhar arroz', inputs: {rice: 2, water: 1}, output: {item: 'meal', quantity: 1}, station: 'cookfire'},
    };

    function create() {
        return {objects: {}, stones: {}};
    }

    function at(h, index) {
        return Object.hasOwn(h.objects, index) ? h.objects[index] : undefined;
    }

    function bounds(kind, x, y, cw, ch) {
        if (!Object.hasOwn(objects, kind)) return null;
        const footprint = objects[kind].footprint;
        const left = x * cw + footprint.x * cw;
        const top = y * ch + footprint.y * ch;
        return {left, top, right: left + footprint.width * cw, bottom: top + footprint.height * ch};
    }

    function shape(kind, x, y, cw, ch) {
        const rect = bounds(kind, x, y, cw, ch);
        if (!rect) return null;
        return {
            x: (rect.left + rect.right) / 2,
            y: (rect.top + rect.bottom) / 2,
            rx: (rect.right - rect.left) / 2,
            ry: (rect.bottom - rect.top) / 2,
            shape: 'box',
        };
    }

    function land(s, index) {
        const cell = Number.isInteger(index) && s.cells[index];
        return cell && !cell.channel && cell.surface <= 8 ? cell : null;
    }

    function place(h, s, bag, index, kind, blocked) {
        if (!Object.hasOwn(objects, kind)) return 'item';
        const cell = land(s, index);
        if (!cell || cell.b > .16) return 'target';
        if (at(h, index) || blocked?.(cell, index, objects[kind])) return 'occupied';
        if (!(bag.mallet > 0)) return 'tool';
        if (!inventory.take(bag, kind, 1)) return 'ingredients';
        h.objects[index] = kind === 'chest' ? {kind, stock: {}} : {kind};
        return 'ok';
    }

    function craft(h, bag, id, stationIndex) {
        if (!Object.hasOwn(recipes, id)) return 'recipe';
        const recipe = recipes[id];
        if (recipe.station && at(h, stationIndex)?.kind !== recipe.station) return 'station';
        // Stage input removal first because an emptied stack can make space for the output.
        const next = {...bag};
        for (const [item, quantity] of Object.entries(recipe.inputs)) {
            if (!inventory.take(next, item, quantity)) return 'ingredients';
        }
        const {item, quantity} = recipe.output;
        if (!inventory.add(next, item, quantity)) return 'full';
        Object.assign(bag, next);
        return 'ok';
    }

    function storable(item) {
        return Object.hasOwn(inventory.items, item) && !backpackOnly.has(item);
    }

    function transfer(h, bag, index, item, quantity, direction) {
        const object = at(h, index);
        if (object?.kind !== 'chest') return 'target';
        if (!storable(item) || !Number.isSafeInteger(quantity) || quantity <= 0) return 'item';
        if (direction !== 'deposit' && direction !== 'withdraw') return 'item';
        const deposit = direction === 'deposit';
        const source = deposit ? bag : object.stock;
        const destination = deposit ? object.stock : bag;
        if (!(source[item] >= quantity)) return 'ingredients';
        const total = (destination[item] || 0) + quantity;
        const capacity = deposit ? storageCapacity : inventory.cap;
        if (inventory.slots({...destination, [item]: total}) > capacity) return 'full';
        inventory.take(source, item, quantity);
        destination[item] = total;
        return 'ok';
    }

    function collectWater(s, bag, index, quantity = 1) {
        if (!Number.isSafeInteger(quantity) || quantity <= 0) return 'item';
        const cell = Number.isInteger(index) && s.cells[index];
        const volume = waterVolume * quantity;
        if (!cell?.channel || cell.surface < volume) return 'source';
        if (!inventory.add(bag, 'raw_water', quantity)) return 'full';
        cell.surface -= volume;
        s.ledger.waterOut += volume;
        return 'ok';
    }

    function woodAvailable(s, index) {
        const cell = land(s, index);
        return cell ? Math.floor(cell.wood / woodCarbon) : 0;
    }

    function gatherWood(s, bag, index) {
        if (woodAvailable(s, index) < 1) return 'source';
        if (!inventory.add(bag, 'wood', 1)) return 'full';
        const cell = s.cells[index];
        const nitrogen = cell.woodN * (woodCarbon / cell.wood);
        cell.wood -= woodCarbon;
        cell.woodN -= nitrogen;
        s.ledger.carbonOut += woodCarbon;
        s.ledger.nOut += nitrogen;
        s.ledger.pOut += nitrogen * .15;
        return 'ok';
    }

    function stoneAvailable(h, s, index) {
        const cell = land(s, index);
        if (!cell || (cell.kind !== 'dry' && cell.b > .16)) return 0;
        return stoneReserve - (h.stones[index] || 0);
    }

    function gatherStone(h, s, bag, index) {
        if (stoneAvailable(h, s, index) <= 0) return 'source';
        if (!inventory.add(bag, 'stone', 1)) return 'full';
        h.stones[index] = (h.stones[index] || 0) + 1;
        return 'ok';
    }

    function record(value) {
        return value != null && Object.getPrototypeOf(value) === Object.prototype;
    }

    function valid(h, s) {
        if (!record(h) || !record(h.objects) || !record(h.stones)) return false;
        function landKey(key) {
            const cell = /^\d+$/.test(key) && String(Number(key)) === key && s.cells[Number(key)];
            return cell && !cell.channel;
        }
        for (const [key, object] of Object.entries(h.objects)) {
            if (!landKey(key) || !record(object) || !Object.hasOwn(objects, object.kind)) return false;
            if (object.kind === 'chest') {
                if (!inventory.validBag(object.stock, storageCapacity) || !Object.keys(object.stock).every(storable)) return false;
            } else if (Object.hasOwn(object, 'stock')) {
                return false;
            }
        }
        for (const [key, gathered] of Object.entries(h.stones)) {
            if (!landKey(key) || !Number.isInteger(gathered) || gathered < 1 || gathered > stoneReserve) return false;
        }
        return true;
    }

    return {objects, recipes, storageCapacity, create, at, bounds, shape, place, craft, storable, transfer,
        collectWater, woodAvailable, gatherWood, stoneAvailable, gatherStone, valid};
})();
if (typeof module !== 'undefined') module.exports = Homestead;
