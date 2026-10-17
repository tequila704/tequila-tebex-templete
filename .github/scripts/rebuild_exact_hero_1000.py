from pathlib import Path
import base64
import hashlib

parts = [Path('.hero-exact/chunk00.txt'), Path('.hero-exact/chunk01.txt'), Path('.hero-exact/chunk02.txt')]
encoded = ''.join(p.read_text().strip() for p in parts)
data = base64.b64decode(encoded, validate=True)
expected_len = 26508
expected_sha256 = '7d4fbee23a914950bac414e3407c630224b1d1be3760fa62cd76613e6c69d6cb'
assert len(data) == expected_len, (len(data), expected_len)
assert hashlib.sha256(data).hexdigest() == expected_sha256
assert data[:4] == b'RIFF' and data[8:12] == b'WEBP'

asset = Path('assets/tequila5m-hero-new.webp')
asset.write_bytes(data)

home = Path('home.html')
text = home.read_text()
import re
text = re.sub(r'assets/tequila5m-hero-new\.webp\?v=[^"\']+', 'assets/tequila5m-hero-new.webp?v=20261017-exact1000', text)
home.write_text(text)

print('exact hero rebuilt', len(data), hashlib.sha256(data).hexdigest())
