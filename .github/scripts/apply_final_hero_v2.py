from pathlib import Path
import base64
import hashlib
import itertools

EXPECTED = {
    'chunk00.txt': '025d1d01049d24d4925fba8fe0f2257e8fe69f60b0a69eb96fcb4c79e0123276',
    'chunk01.txt': '3ec20aefb5316d1ba2745e00a18139fc1cc3c3d60c7a65f631f9b4f4226d585f',
    'chunk02.txt': '9d03447676d244ba634abeb9ffc8495ea0f7e04e66e3a668dd1159e301792300',
    'chunk03.txt': '9a991e356b840077d42034c0cb579a9cc7882d61c1e6295444c8d0bfcf66b8fc',
    'chunk04.txt': 'e8b858e7abd1fae2d9b5df99fabc3ae336e905b5dd6318a83341e5ca767e5063',
    'chunk05.txt': 'b322d316eccedd214c7b21a77554765e24cc67a8f18902154bdaf1eedca4e200',
    'chunk06.txt': '255fcf296b0e0e59c33aaf0a82d0c85d84cf84fce5396c0d3d6b43adf351f910',
    'chunk07.txt': '4d39ec375aa2abd2996a9cf4c51dee457b641bd30ec35b25714bd053ba262ab7',
}
ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

def digest(s: str) -> str:
    return hashlib.sha256(s.encode('ascii')).hexdigest()

def repair_single_insert(s: str, wanted: str) -> str | None:
    print(f'Trying one-character insertion repair on {len(s)} chars...')
    # Check likely corruption region in broad order, then full range.
    for pos in range(len(s) + 1):
        left, right = s[:pos], s[pos:]
        for ch in ALPHABET:
            candidate = left + ch + right
            if digest(candidate) == wanted:
                print(f'Repaired missing char at {pos}: {ch}')
                return candidate
    return None

def repair_whitespace_replacements(s: str, wanted: str) -> str | None:
    spots = [i for i, ch in enumerate(s) if ch.isspace()]
    print(f'Whitespace positions: {spots}')
    if not spots or len(spots) > 3:
        return None
    chars = list(s)
    for repl in itertools.product(ALPHABET, repeat=len(spots)):
        for idx, ch in zip(spots, repl):
            chars[idx] = ch
        candidate = ''.join(chars)
        if digest(candidate) == wanted:
            print(f'Repaired whitespace replacements: {list(zip(spots, repl))}')
            return candidate
    return None

def repair_single_substitution(s: str, wanted: str) -> str | None:
    print(f'Trying one-character substitution repair on {len(s)} chars...')
    original = list(s)
    for pos, old in enumerate(original):
        for ch in ALPHABET:
            if ch == old:
                continue
            original[pos] = ch
            candidate = ''.join(original)
            if digest(candidate) == wanted:
                print(f'Repaired substitution at {pos}: {old} -> {ch}')
                return candidate
        original[pos] = old
    return None

parts = sorted(Path('.hero-upload').glob('chunk*.txt'))
assert len(parts) == 8, f'Expected 8 chunks, got {len(parts)}'
fixed = []
for p in parts:
    s = p.read_text()
    wanted = EXPECTED[p.name]
    got = digest(s)
    print(f'{p.name}: len={len(s)} sha={got}')
    if got != wanted:
        repaired = None
        if any(ch.isspace() for ch in s):
            repaired = repair_whitespace_replacements(s, wanted)
        if repaired is None and len(s) == 18999:
            repaired = repair_single_insert(s, wanted)
        if repaired is None and len(s) == 19000:
            repaired = repair_single_substitution(s, wanted)
        if repaired is None:
            raise SystemExit(f'Could not repair {p.name}')
        s = repaired
        assert digest(s) == wanted
        p.write_text(s)
    fixed.append(s)

encoded = ''.join(fixed)
assert len(encoded) == 147348, len(encoded)
data = base64.b64decode(encoded, validate=True)
assert len(data) == 110510, len(data)
assert data[:4] == b'RIFF' and data[8:12] == b'WEBP', data[:16]
Path('assets/tequila5m-hero-final.webp').write_bytes(data)
print('Final WebP rebuilt:', len(data), hashlib.sha256(data).hexdigest())

home_path = Path('home.html')
home = home_path.read_text()
for old in (
    'assets/tequila5m-hero-new.webp?v=20261017-newhero',
    'assets/tequila5m-hero-final.webp?v=20261017-finalhero',
    'assets/tequila5m-hero-final.webp?v=20261017-finalhero2',
):
    home = home.replace(old, 'assets/tequila5m-hero-final.webp?v=20261017-finalhero3')
home_path.write_text(home)

index_path = Path('index.html')
index = index_path.read_text()
# Keep any previous final fix but use the newest cache key.
index = index.replace('assets/tequila5m-hero-final.webp?v=20261017-finalhero2', 'assets/tequila5m-hero-final.webp?v=20261017-finalhero3')
index = index.replace('assets/tequila5m-hero-final.webp?v=20261017-finalhero', 'assets/tequila5m-hero-final.webp?v=20261017-finalhero3')
marker = '    addPremiumDOM(doc); enhanceCategories(doc);'
if 'tq-final-hero-fix' not in index:
    replacement = '''    if(!doc.getElementById('tq-final-hero-fix')){
      const heroFix=doc.createElement('style');
      heroFix.id='tq-final-hero-fix';
      heroFix.textContent=`
.hero-image-wrap{min-height:0!important;background:#000!important;border-radius:24px!important;overflow:hidden!important}
.hero-image-wrap:before,.hero-image-wrap:after{display:none!important}
.hero-image{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;object-fit:contain!important;filter:none!important;transform:none!important}
.hero-shade,#tq-hero-overlay{display:none!important}
.hero-actions{display:none!important}
.tq-hero-hotspots{position:absolute;inset:0;z-index:6;pointer-events:none}
.tq-hero-hotspot{position:absolute;top:79%;height:9%;pointer-events:auto;border:0;background:transparent;color:transparent!important;font-size:0;border-radius:14px;cursor:pointer}
.tq-hero-shop{left:3.2%;width:13.5%}
.tq-hero-discord{left:17.5%;width:12%}
.tq-hero-copy{left:30.5%;width:13%}
@media(max-width:680px){.hero-image-wrap{border-radius:18px!important}}
`;
      doc.head.appendChild(heroFix);
    }
    addPremiumDOM(doc); enhanceCategories(doc);
    const finalHero=doc.querySelector('.hero-image');
    if(finalHero) finalHero.src='assets/tequila5m-hero-final.webp?v=20261017-finalhero3';
    const heroWrap=doc.querySelector('.hero-image-wrap');
    if(heroWrap&&!doc.getElementById('tq-hero-hotspots')){
      const hs=doc.createElement('div');
      hs.id='tq-hero-hotspots';
      hs.className='tq-hero-hotspots';
      hs.innerHTML=`<a class="tq-hero-hotspot tq-hero-shop" href="https://tequila.tebex.io/" target="_blank" rel="noopener" aria-label="Shop on Tebex"></a><a class="tq-hero-hotspot tq-hero-discord" href="https://discord.gg/QhgUH3RFuz" target="_blank" rel="noopener" aria-label="Join Discord"></a><button class="tq-hero-hotspot tq-hero-copy" type="button" aria-label="Copy Store Link"></button>`;
      heroWrap.appendChild(hs);
      hs.querySelector('.tq-hero-copy')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('https://tequila.tebex.io/');}catch(e){}});
    }'''
    if marker not in index:
        raise SystemExit('Could not find index hero patch marker')
    index = index.replace(marker, replacement, 1)
index_path.write_text(index)
