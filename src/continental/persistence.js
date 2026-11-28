// Mesmo formato para arquivo portátil e para o slot de armazenamento do navegador.
function validateFieldPlayer(farm, player) {
    const world = farm?.world;
    if (world?.w !== COLS || world.h !== ROWS ||
        !Number.isFinite(player?.x) || !Number.isFinite(player.y) ||
        blocked(player.x, player.y) || !['up','down','left','right'].includes(player.dir)) {
        throw Error('Posição ou mapa incompatível com o campo continental.');
    }
}

function encodeFarmSave(farm, player) {
    validateFieldPlayer(farm, player);
    validateFarm(farm);
    return JSON.stringify({format:'ilha-viva/vale-do-amieiro', version:1, farm,
        player:{x:player.x, y:player.y, dir:player.dir}});
}

function decodeFarmSave(text) {
    const data = JSON.parse(text);
    if (data?.format !== 'ilha-viva/vale-do-amieiro' || data.version !== 1)
        throw Error('Arquivo de outra região ou versão.');
    validateFieldPlayer(data.farm, data.player);
    validateFarm(data.farm);
    return {farm:data.farm, player:data.player};
}
