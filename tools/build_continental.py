"""Empacota os módulos científicos locais e a arte aprovada em um único HTML."""
import base64
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src/continental'
OUTPUT = ROOT / 'play/Ilha_Viva_Campo_Continental_03.html'
IMPORT = re.compile(r"^import\s*\{([^}]+)\}\s*from\s*['\"]\./(\w+)\.mjs['\"];?", re.M)
EXPORT = re.compile(r'^export (?:function|const) (\w+)', re.M)


def science_bundle():
    """Resolve os imports nomeados usados pelo motor, preservando o escopo por módulo."""
    modules = {}

    def visit(name):
        if name in modules:
            return
        body = (ROOT / 'scientific/us' / (name + '.mjs')).read_text()
        for _, dependency in IMPORT.findall(body):
            visit(dependency)
        body = IMPORT.sub(lambda match: 'const {' + match[1].strip() + '} = us_' + match[2] + ';', body)
        names = ', '.join(EXPORT.findall(body))
        body = re.sub(r'^export (?=function |const )', '', body, flags=re.M)
        if re.search(r'^\s*(?:import|export)\s', body, re.M):
            raise ValueError('Sintaxe de módulo sem suporte em ' + name)
        modules[name] = f'const us_{name} = (() => {{\n{body}\nreturn {{{names}}};\n}})();'

    visit('farm')
    return '\n'.join([*modules.values(), 'const {weather,profile} = us_world;',
                      'const {createFarm,stepFarm,plantFarm,harvestFarm,waterFarm,validateFarm} = us_farm;'])


def main():
    raw = (ROOT / 'assets/runtime/ART.json').read_bytes()
    if hashlib.sha256(raw).hexdigest() != 'e3983cd78fd5f387fa135d4cd063707a93134c2312a61f3b84bea9967f216c61':
        raise ValueError('O atlas difere do original documentado no checkpoint.')
    art = json.loads(raw)
    packed = json.dumps({k: art[k] for k in ('atlas', 'images')}, separators=(',', ':'))
    scene = base64.b64encode((SRC / 'paisagem.png').read_bytes()).decode()
    source = '\n'.join([science_bundle(), f'const HERO = {packed};',
        'const REGIONS = ' + (SRC / 'paisagem.json').read_text() + ';',
        f'const SCENE_IMAGE = "data:image/png;base64,{scene}";',
        *[(SRC / f).read_text() for f in ('landscape.js','persistence.js','field.js')]])
    html = (SRC / 'field.html').read_text().replace('@@SOURCES@@', source)
    OUTPUT.write_bytes(html.encode())
    print(OUTPUT.name, len(html.encode()), hashlib.sha256(html.encode()).hexdigest())


if __name__ == '__main__':
    main()
