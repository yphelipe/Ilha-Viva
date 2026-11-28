"""Conferir o atlas aprovado e seus metadados sem regravar o arquivo original."""
import base64
import hashlib
import io
import json
import math
import unittest
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


class ApprovedAtlas(unittest.TestCase):
    def test_pngs_and_animation_metadata(self):
        data = (ROOT / 'assets/runtime/ART.json').read_bytes()
        self.assertEqual(hashlib.sha256(data).hexdigest(),
                         'e3983cd78fd5f387fa135d4cd063707a93134c2312a61f3b84bea9967f216c61')
        with zipfile.ZipFile(ROOT / 'Ilha_Viva_Base_v0.47.zip') as source:
            self.assertEqual(data, source.read('assets/runtime/ART.json'))
        atlas = json.loads(data)
        self.assertEqual(len(atlas['images']), 127)
        sizes = {}
        for key, url in atlas['images'].items():
            prefix, b64 = url.split(',', 1)
            self.assertEqual(prefix, 'data:image/png;base64')
            with Image.open(io.BytesIO(base64.b64decode(b64, validate=True))) as im:
                im.load()
                self.assertEqual(im.mode, 'RGBA')
                transparent, strongest = im.getchannel('A').getextrema()
                self.assertEqual(transparent, 0)
                self.assertGreater(strongest, 0)
                sizes[key] = im.size
        self.assertEqual(set(atlas['atlas']), {
            'idle', 'walk', 'run', 'swimPants', 'water', 'axe', 'sickle', 'hoe'})
        used = set()
        slots = mirrors = 0
        for directions in atlas['atlas'].values():
            self.assertEqual(set(directions), {'down', 'left', 'right', 'up'})
            for sequence in directions.values():
                self.assertTrue(sequence)
                for frame in sequence:
                    self.assertEqual(sizes[frame['id']], (frame['w'], frame['h']))
                    for pivot, bound in [('ax', 'w'), ('ay', 'h')]:
                        self.assertTrue(math.isfinite(frame[pivot]))
                        self.assertTrue(0 <= frame[pivot] <= frame[bound])
                    used.add(frame['id'])
                    slots += 1
                    mirrors += bool(frame.get('mirror'))
        self.assertEqual((slots, mirrors), (131, 6))
        self.assertEqual(used, set(sizes))

    def test_standalone_build_embeds_original_hero_and_complete_scene_atlas(self):
        html = (ROOT / 'play/Ilha_Viva_Campo_Continental_04.html').read_text()
        source = json.loads((ROOT / 'assets/runtime/ART.json').read_bytes())
        decoder = json.JSONDecoder()
        def embedded(name):
            marker = f'const {name} = '
            value, _ = decoder.raw_decode(html.split(marker, 1)[1])
            return value
        self.assertEqual(embedded('HERO'), {k: source[k] for k in ('atlas', 'images')})
        regions = embedded('REGIONS')
        directory = ROOT / 'src/continental'
        self.assertEqual(regions, json.loads((directory / 'paisagem.json').read_text()))
        payload = base64.b64decode(embedded('SCENE_IMAGE').split(',', 1)[1], validate=True)
        self.assertEqual(payload, (directory / 'paisagem.png').read_bytes())
        rectangles = []
        with Image.open(io.BytesIO(payload)) as sheet:
            self.assertEqual(sheet.mode, 'RGBA')
            for name, (x, y, w, h) in regions.items():
                with self.subTest(asset=name):
                    self.assertTrue(w > 0 and h > 0 and x >= 0 and y >= 0)
                    self.assertLessEqual(x+w, sheet.width)
                    self.assertLessEqual(y+h, sheet.height)
                    self.assertTrue(all(x+w <= a or b <= x or y+h <= c or d <= y
                                        for a, b, c, d in rectangles))
                    rectangles.append((x, x+w, y, y+h))
                    alpha = sheet.crop((x, y, x+w, y+h)).getchannel('A')
                    self.assertEqual(alpha.getextrema(), (0, 255))


if __name__ == '__main__':
    unittest.main()
