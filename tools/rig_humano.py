"""Laboratório lateral FK/IK. Coordenadas locais em pixels, eixo y para baixo."""
import base64
import io
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SIZE = (80, 96)
PIVOT = (40, 84)
FRAMES = 24
STRIDE = 32
STANCE = 0.60


def fk(parent, length, angle):
    """Ângulo em radianos relativo à vertical descendente."""
    return (parent[0] + length * math.sin(angle), parent[1] + length * math.cos(angle))


def leg_ik(hip, ankle, thigh=18, shin=18):
    """Escolhe o joelho anterior. Rejeita alvos que exigiriam alongar a perna."""
    dx, dy = ankle[0] - hip[0], ankle[1] - hip[1]
    distance = math.hypot(dx, dy)
    if not abs(thigh - shin) < distance <= thigh + shin:
        raise ValueError("Alvo fora do alcance da perna")
    knee_cos = (thigh**2 + shin**2 - distance**2) / (2 * thigh * shin)
    flexion = math.pi - math.acos(max(-1, min(1, knee_cos)))
    if flexion > math.radians(100):
        raise ValueError("Flexão além da faixa autorizada para esta marcha")
    along = (thigh**2 - shin**2 + distance**2) / (2 * distance)
    normal = math.sqrt(max(0, thigh**2 - along**2))
    return (hip[0] + (dx * along + dy * normal) / distance,
            hip[1] + (dy * along - dx * normal) / distance)


def foot_target(time, offset):
    """Durante apoio, a posição absoluta do tornozelo é constante."""
    phase = (time + offset) % 1
    x = STRIDE * (STANCE / 2 - phase)
    lift = 0
    if phase > STANCE:
        swing = (phase - STANCE) / (1 - STANCE)
        smooth = swing * swing * (3 - 2 * swing)
        x += STRIDE * smooth
        lift = 6 * math.sin(math.pi * swing) ** 2
    return (x, -2 - lift), phase <= STANCE


def pose(time, walking=True):
    phase = time % 1 if walking else 0
    hip = (0, -34 - (1 - math.cos(4 * math.pi * phase)) * 0.6)
    shoulder = fk(hip, 19, math.pi - 0.06)
    limbs = []
    for side in (0, 0.5):
        ankle, contact = foot_target(phase, side) if walking else ((side * 8 - 2, -2), True)
        swing = -0.35 * math.cos(2 * math.pi * (phase + side)) if walking else -0.08
        elbow = fk(shoulder, 12, swing)
        wrist = fk(elbow, 11, swing + 0.34)
        knee = leg_ik(hip, ankle)
        toe = (ankle[0] + 6, ankle[1] + 2)
        limbs.append(dict(knee=knee, ankle=ankle, toe=toe, elbow=elbow, wrist=wrist, contact=contact))
    return dict(hip=hip, shoulder=shoulder, head=fk(shoulder, 11, math.pi),
                limbs=limbs, travel=STRIDE * time if walking else 0)


def render_sheet(walking):
    sheet = Image.new('RGBA', (SIZE[0] * FRAMES, SIZE[1]))
    for frame in range(FRAMES):
        data = pose(frame / FRAMES, walking)
        image = Image.new('RGBA', SIZE)
        draw = ImageDraw.Draw(image)
        def point(xy):
            return (round(PIVOT[0] + xy[0]), round(PIVOT[1] + xy[1]))
        def chain(points, color):
            draw.line([point(p) for p in points], fill=color, width=2)
            for p in points:
                x, y = point(p)
                draw.ellipse((x-1, y-1, x+1, y+1), fill=color)
        for index, limb in enumerate(data['limbs']):
            color = '#7a91a3' if index == 0 else '#ffc580'
            chain([data['hip'], limb['knee'], limb['ankle'], limb['toe']], color)
            chain([data['shoulder'], limb['elbow'], limb['wrist']], color)
        chain([data['hip'], data['shoulder'], data['head']], '#acdebb')
        sheet.paste(image, (frame * SIZE[0], 0))
    buffer = io.BytesIO()
    sheet.save(buffer, format='PNG')
    return buffer.getvalue()


def build():
    art = json.loads((ROOT / 'assets/runtime/ART.json').read_text())
    clips = {a: art['atlas'][a]['right'] for a in ('idle', 'walk')}
    images = {f['id']: art['images'][f['id']] for clip in clips.values() for f in clip}
    guides = {a: 'data:image/png;base64,' + base64.b64encode(render_sheet(a == 'walk')).decode()
              for a in clips}
    data = dict(clips=clips, images=images, guides=guides, size=SIZE, pivot=PIVOT, frames=FRAMES)
    template = (ROOT / 'src/rig_humano.html').read_text()
    (ROOT / 'play/Ilha_Viva_Rig_Humano.html').write_text(template.replace('@@RIG@@', json.dumps(data)))


if __name__ == '__main__':
    build()
