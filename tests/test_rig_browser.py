"""Prova offline da comparação e da exportação PNG no Chromium."""
import os
import tempfile
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or None)
    page = browser.new_page(viewport={'width': 393, 'height': 852}, has_touch=True, offline=True)
    errors = []
    page.on('pageerror', lambda exc: errors.append(str(exc)))
    page.set_content((ROOT / 'play/Ilha_Viva_Rig_Humano.html').read_text())
    page.wait_for_function('Object.values(images).every(i=>i.naturalWidth) && Object.values(guides).every(i=>i.naturalWidth)')
    page.locator('#toggle').tap()
    page.wait_for_function("Number(phase.value)>1")
    page.locator('#toggle').tap()
    page.locator('#action').select_option('idle')
    assert page.locator('#count').inner_text() == '1 / 24'
    with tempfile.TemporaryDirectory() as path:
        with page.expect_download() as pending:
            page.locator('#sheet').tap()
        target = Path(path) / 'sheet.png'
        pending.value.save_as(target)
        with Image.open(target) as png:
            assert png.mode == 'RGBA' and png.size == (1920, 96)
    page.locator('#action').select_option('walk')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert not errors, errors
    (ROOT / 'qa').mkdir(exist_ok=True)
    page.screenshot(path=ROOT / 'qa/rig_humano.png')
    browser.close()
print('Rig lateral: referências e guias decodificadas offline, toque, troca de ação, PNG RGBA, viewport e console verificados.')
