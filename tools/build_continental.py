"""Gera o Campo Continental 02 offline a partir dos módulos e atlas versionados."""
import base64
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src/continental'
OUTPUT = ROOT / 'play/Ilha_Viva_Campo_Continental_02.html'
MODULES = ('soil_cell', 'world', 'steward', 'save')


def main():
    raw = (ROOT / 'assets/runtime/ART.json').read_bytes()
    blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    if blob != 'a3dac070adb3400e373232affcd6bbed1a84b1f3':
        raise ValueError('O atlas difere do original documentado no checkpoint.')
    art = json.loads(raw)
    # O terreno histórico é externo ao atlas do protagonista.
    packed = json.dumps({k: art[k] for k in ('atlas', 'images')}, separators=(',', ':'))
    scene = base64.b64encode((SRC / 'paisagem.png').read_bytes()).decode()
    modules = []
    for name in MODULES:
        module = (ROOT / 'scientific/us' / (name + '.mjs')).read_text()
        module = re.sub(r'^import\s+[^;]+;\s*', '', module, flags=re.M)
        exports = re.findall(r'^export (?:function|const) (\w+)', module, flags=re.M)
        # Encapsula constantes e auxiliares privados para evitar colisões entre módulos.
        body = re.sub(r'^export ', '', module, flags=re.M)
        names = ', '.join(exports)
        modules.append(f'const {{{names}}} = (() => {{\n{body}\nreturn {{{names}}};\n}})();')
    source = '\n'.join(modules + [
        f'const HERO = {packed};',
        'const REGIONS = ' + (SRC / 'paisagem.json').read_text() + ';',
        f'const SCENE_IMAGE = "data:image/png;base64,{scene}";',
        (SRC / 'landscape.js').read_text(), (SRC / 'field.js').read_text()
    ])
    html = (SRC / 'field.html').read_text().replace('@@SOURCES@@', source)
    OUTPUT.write_bytes(html.encode())
    print(OUTPUT.name, len(html.encode()), hashlib.sha256(html.encode()).hexdigest())


if __name__ == '__main__':
    main()
