from pathlib import Path
import base64

parts = sorted(Path('.hero-upload').glob('chunk*.txt'))
assert len(parts) == 8, f"Expected 8 hero chunks, got {len(parts)}"
encoded = ''.join(p.read_text() for p in parts)
encoded = ''.join(encoded.split())
data = base64.b64decode(encoded, validate=True)
assert data[:4] == b'RIFF' and data[8:12] == b'WEBP', data[:16]
Path('assets/tequila5m-hero-final.webp').write_bytes(data)

home_path = Path('home.html')
home = home_path.read_text()
old_hero = 'assets/tequila5m-hero-new.webp?v=20261017-newhero'
new_hero = 'assets/tequila5m-hero-final.webp?v=20261017-finalhero'
if old_hero not in home and new_hero not in home:
    raise SystemExit('Could not find current hero source in home.html')
home = home.replace(old_hero, new_hero)
home_path.write_text(home)

index_path = Path('index.html')
index = index_path.read_text()
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
    if(finalHero) finalHero.src='assets/tequila5m-hero-final.webp?v=20261017-finalhero';
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

print(f'Hero rebuilt: {len(data)} bytes')
