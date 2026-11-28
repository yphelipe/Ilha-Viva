"""Exercise the standalone field in mobile Chromium using its public controls."""
import argparse
import functools
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import threading
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
FIELD = ROOT / 'play/Ilha_Viva_Campo_Continental_03.html'


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def test_field(evidence=None):
    server = ThreadingHTTPServer(('127.0.0.1', 0),
                                functools.partial(QuietHandler, directory=str(FIELD.parent)))
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    checks = []

    def check(name, condition):
        if not condition:
            raise AssertionError(name)
        checks.append(name)

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                executable_path=os.environ.get('CHROMIUM_PATH'), args=['--no-sandbox'])
            context = browser.new_context(viewport={'width': 390, 'height': 844},
                                          is_mobile=True, has_touch=True, device_scale_factor=1)
            page = context.new_page()
            errors, external = [], []
            def allow_local(route):
                address = urlsplit(route.request.url)
                if address.scheme in ('http', 'https') and (
                    address.hostname != '127.0.0.1' or address.port != server.server_port
                ):
                    external.append(route.request.url)
                    route.abort()
                else:
                    route.continue_()
            context.route('**/*', allow_local)
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(f'http://127.0.0.1:{server.server_port}/{FIELD.name}')
            context.set_offline(True)
            page.wait_for_function('window.Continental && Continental.snapshot().player')
            snapshot = lambda: page.evaluate('Continental.snapshot()')
            start = snapshot()
            check('scientific world and visible canvas', len(start['world']['cells']) ==
                  start['world']['w'] * start['world']['h'] and page.locator('#field').is_visible())
            check('portrait layout fits viewport', page.evaluate(
                'document.documentElement.scrollWidth <= window.innerWidth'))
            page.wait_for_function('''() => {
                const c = document.querySelector('#field');
                if (c.width === 0 || c.height === 0) return false;
                const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
                const palette = new Set();
                for (let i=0;i<pixels.length;i+=4*19) {
                    if (pixels[i+3]) palette.add(pixels[i]*65536+pixels[i+1]*256+pixels[i+2]);
                    if (palette.size>80) return true;
                }
                return false;
            }''')
            checks.append('landscape canvas renders varied opaque artwork')
            if evidence:
                evidence.mkdir(parents=True, exist_ok=True)
                page.screenshot(path=str(evidence / 'campo_retrato.png'), full_page=True)
            page.locator('#plant').tap()
            page.wait_for_function("Continental.snapshot().action === 'idle'")
            check('plant consumes one batch of starts', snapshot()['farm']['garden']['stock']['starts'] == 5)
            page.locator('#plant').tap()
            check('duplicate planting blocked', snapshot()['farm']['garden']['stock']['starts'] == 5)
            page.locator('#harvest').tap()
            check('premature harvest blocked', snapshot()['farm']['garden']['stock']['cropC'] == 0)
            page.locator('#run').tap()
            check('mobile run toggle', page.locator('#run').get_attribute('aria-pressed') == 'true')
            page.locator('#run').tap()
            check('mobile run toggle off', page.locator('#run').get_attribute('aria-pressed') == 'false')
            page.locator('#next').tap()
            check('tap advances autonomous day', snapshot()['world']['day'] == start['world']['day'] + 1)
            stationary = snapshot()['player']
            check('world advances with player stationary', stationary['x'] == start['player']['x']
                  and stationary['y'] == start['player']['y'])
            page.evaluate('Continental.step(6)')
            evolved = snapshot()
            check('soil changes during seven days', start['world']['cells'] != evolved['world']['cells'])
            page.locator('summary').tap()
            page.locator('#save').tap()
            check('real local storage contains a save', page.evaluate('localStorage.length > 0'))
            page.keyboard.down('ArrowRight')
            try:
                page.wait_for_function('x => Continental.snapshot().player.x > x', arg=stationary['x'])
            finally:
                page.keyboard.up('ArrowRight')
            check('keyboard movement and direction', snapshot()['player']['x'] > stationary['x'])
            page.evaluate('Continental.step(2)')
            page.locator('#load').tap()
            restored = snapshot()
            check('save restores player and complete ecological state', restored['world'] == evolved['world']
                  and restored['player']['x'] == stationary['x'] and restored['player']['y'] == stationary['y'])
            with page.expect_download() as download:
                page.locator('#export').tap()
            exported = download.value.path().read_bytes()
            page.evaluate('Continental.step(1)')
            dirty_day = snapshot()['world']['day']
            page.locator('#import').set_input_files({
                'name': 'partida.json', 'mimeType': 'application/json', 'buffer': exported})
            page.wait_for_function('day => Continental.snapshot().world.day !== day', arg=dirty_day)
            check('export and import restore ecology and learned memory', snapshot()['world'] == evolved['world'])
            # Repeat bounded increments as in a normal frame, aimed through the front of the farmhouse.
            page.evaluate('for (let i=0;i<180;i++) Continental.move(0,-1,1/60)')
            hit = snapshot()['player']
            page.evaluate('for (let i=0;i<60;i++) Continental.move(0,-1,1/60)')
            check('farmhouse footprint stops travel', 0 < hit['y'] < stationary['y'] and
                  snapshot()['player']['y'] == hit['y'])
            check('camera follows traversal', snapshot()['camera'] != evolved['camera'])
            page.locator('#load').tap()
            button = page.locator('[data-dir="right"]')
            box = button.bounding_box()
            touch = context.new_cdp_session(page)
            coord = {'x': box['x'] + box['width'] / 2, 'y': box['y'] + box['height'] / 2}
            touch.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [coord]})
            try:
                page.wait_for_function('x => Continental.snapshot().player.x > x', arg=stationary['x'])
            finally:
                touch.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            check('held touch direction moves player', snapshot()['player']['x'] > stationary['x'])
            page.locator('#load').tap()
            page.set_viewport_size({'width': 844, 'height': 390})
            page.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
            check('landscape layout fits viewport', page.evaluate(
                'document.documentElement.scrollWidth <= window.innerWidth'))
            if evidence:
                page.screenshot(path=str(evidence / 'campo_paisagem.png'), full_page=True)
            check('no external requests or JavaScript exceptions', not errors and not external)
            result = {'artifact': FIELD.name, 'sha256': hashlib.sha256(FIELD.read_bytes()).hexdigest(),
                      'browser': browser.version, 'offline_after_local_navigation': True,
                      'android_physical': False, 'passed': len(checks), 'checks': checks}
            if evidence:
                (evidence / 'campo_browser.json').write_text(json.dumps(result, indent=2) + '\n')
            print(json.dumps(result, indent=2))
            browser.close()
    finally:
        server.shutdown()
        worker.join()
        server.server_close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--evidence', type=Path)
    test_field(parser.parse_args().evidence)
