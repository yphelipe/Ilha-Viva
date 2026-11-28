"""Gera o campo histórico (padrão) ou o campo continental a partir das fontes."""
import argparse
import hashlib
from pathlib import Path
import re

from build_continental import main as build_continental


def build_historical():
    root = Path(__file__).resolve().parents[1]
    template = (root / 'src/field.template.html').read_text()
    source = re.sub(r'@@FILE:([^@]+)@@', lambda m: (root / m[1]).read_text(), template)
    assert '@@FILE:' not in source
    out = root / 'play/Ilha_Viva_Campo_05.html'
    out.parent.mkdir(exist_ok=True)
    out.write_bytes(source.encode())
    print(out, hashlib.sha256(out.read_bytes()).hexdigest())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--continental', action='store_true')
    if parser.parse_args().continental:
        build_continental()
    else:
        build_historical()
