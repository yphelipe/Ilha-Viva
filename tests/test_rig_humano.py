import io
import math
import sys
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import rig_humano as rig


class Biomecanica(unittest.TestCase):
    def test_comprimentos_e_limites(self):
        for index in range(240):
            p = rig.pose(index / 240)
            for limb in p['limbs']:
                for a, b, length in ((p['hip'], limb['knee'], 18), (limb['knee'], limb['ankle'], 18),
                                     (p['shoulder'], limb['elbow'], 12), (limb['elbow'], limb['wrist'], 11)):
                    self.assertAlmostEqual(math.dist(a, b), length)
                distance = math.dist(p['hip'], limb['ankle'])
                flexion = 2 * math.degrees(math.acos(distance / 36))
                self.assertLess(flexion, 100)

    def test_pe_plantado_em_coordenadas_absolutas(self):
        for side in (0, 0.5):
            previous = None
            for i in range(200):
                time = i / 100
                foot, contact = rig.foot_target(time, side)
                x = time * rig.STRIDE + foot[0]
                if contact and previous is not None:
                    self.assertAlmostEqual(x, previous)
                    self.assertAlmostEqual(foot[1], -2)
                previous = x if contact else None

    def test_repouso_e_ciclo(self):
        self.assertEqual(rig.pose(0, False), rig.pose(2.7, False))
        self.assertEqual(rig.pose(0)['limbs'], rig.pose(1)['limbs'])
        for i in range(100):
            self.assertTrue(any(limb['contact'] for limb in rig.pose(i/100)['limbs']))

    def test_alvo_impossivel(self):
        with self.assertRaises(ValueError):
            rig.leg_ik((0, 0), (50, 1))
        with self.assertRaisesRegex(ValueError, 'Flexão'):
            rig.leg_ik((0, 0), (1, 5))

    def test_png_recorte_alfa_continuidade(self):
        image = Image.open(io.BytesIO(rig.render_sheet(True)))
        self.assertEqual(image.mode, 'RGBA')
        w, h = rig.SIZE
        self.assertEqual(image.size, (rig.FRAMES*w, h))
        frames = []
        for i in range(rig.FRAMES):
            frame = image.crop((i*w, 0, (i+1)*w, h))
            bounds = frame.getchannel('A').getbbox()
            self.assertTrue(bounds and 0 < bounds[0] < bounds[2] < w and 0 < bounds[1] < bounds[3] < h)
            frames.append(frame.tobytes())
        self.assertEqual(len(set(frames)), rig.FRAMES)


if __name__ == '__main__':
    unittest.main()
