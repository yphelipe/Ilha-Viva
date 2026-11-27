from pathlib import Path
import re, hashlib
root=Path(__file__).resolve().parents[1]
s=(root/'src/field.template.html').read_text(encoding='utf-8')
s=re.sub(r'@@FILE:([^@]+)@@',lambda m:(root/m[1]).read_text(encoding='utf-8'),s)
assert '@@FILE:' not in s
out=root/'play/Ilha_Viva_Campo_05.html';out.parent.mkdir(exist_ok=True);out.write_bytes(s.encode('utf-8'))
print(out, hashlib.sha256(out.read_bytes()).hexdigest())
