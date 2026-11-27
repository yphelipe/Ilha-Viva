from pathlib import Path
r=Path(__file__).resolve().parents[1]
s=(r/'src/viewer.template.html').read_text(encoding='utf-8').replace('@@FILE:assets/runtime/lemurClips.json@@',(r/'assets/runtime/lemurClips.json').read_text(encoding='utf-8'))
(r/'play').mkdir(exist_ok=True)
(r/'play/Ilha_Viva_Lemur_Movimentos_05.html').write_bytes(s.encode('utf-8'))
