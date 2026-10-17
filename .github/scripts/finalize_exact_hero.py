from pathlib import Path
import re

# Bust the browser cache for the replaced hero asset.
home_path = Path('home.html')
home = home_path.read_text(encoding='utf-8')
home = re.sub(
    r'assets/tequila5m-hero-new\.webp\?v=[^"\']+',
    'assets/tequila5m-hero-new.webp?v=20261017-exact-0937',
    home,
)
home_path.write_text(home, encoding='utf-8')

# Keep the premium pink/gold redesign, but let the finished artwork be the hero.
index_path = Path('index.html')
index = index_path.read_text(encoding='utf-8')
marker = "doc.head.appendChild(style);"
patch_id = 'tq-exact-hero-0937'

if patch_id not in index:
    patch = r'''doc.head.appendChild(style);
      if(!doc.getElementById('tq-exact-hero-0937')){
        const exactHeroStyle=doc.createElement('style');
        exactHeroStyle.id='tq-exact-hero-0937';
        exactHeroStyle.textContent=`
.hero{padding-top:22px!important}
.hero-image-wrap{aspect-ratio:1837/837!important;min-height:0!important;height:auto!important;background:#030305!important;border-radius:26px!important;overflow:hidden!important;border:1px solid rgba(255,60,174,.30)!important;box-shadow:0 28px 90px rgba(0,0,0,.62),0 0 42px rgba(255,60,174,.09)!important}
.hero-image-wrap:before,.hero-image-wrap:after{display:none!important}
.hero-image{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;filter:none!important;transform:none!important;opacity:1!important}
.hero-shade,#tq-hero-overlay,.hero-actions{display:none!important}
.tq-shot{display:none!important}
.tq-exact-hotspots{position:absolute;inset:0;z-index:7;pointer-events:none}
.tq-exact-hotspot{position:absolute;top:78.6%;height:9.2%;pointer-events:auto;background:transparent!important;border:0!important;color:transparent!important;font-size:0!important;cursor:pointer;border-radius:16px}
.tq-exact-shop{left:3.25%;width:13.35%}
.tq-exact-discord{left:17.55%;width:12.1%}
.tq-exact-copy{left:30.55%;width:13.05%}
@media(max-width:680px){.hero{padding-top:14px!important}.hero-image-wrap{border-radius:18px!important}.tq-exact-hotspot{border-radius:10px}}
`;
        doc.head.appendChild(exactHeroStyle);
      }'''
    if marker not in index:
        raise SystemExit('Could not find redesign style marker in index.html')
    index = index.replace(marker, patch, 1)

# Add invisible click targets over the buttons that are part of the hero artwork.
anchor = "addPremiumDOM(doc); enhanceCategories(doc);"
if 'tq-exact-hotspots' not in index:
    hotspot_patch = r'''addPremiumDOM(doc); enhanceCategories(doc);
    const exactHeroWrap=doc.querySelector('.hero-image-wrap');
    if(exactHeroWrap&&!doc.getElementById('tq-exact-hotspots')){
      const exactHotspots=doc.createElement('div');
      exactHotspots.id='tq-exact-hotspots';
      exactHotspots.className='tq-exact-hotspots';
      exactHotspots.innerHTML=`<a class="tq-exact-hotspot tq-exact-shop" href="https://tequila.tebex.io/" target="_blank" rel="noopener" aria-label="Shop on Tebex"></a><a class="tq-exact-hotspot tq-exact-discord" href="https://discord.gg/QhgUH3RFuz" target="_blank" rel="noopener" aria-label="Join Discord"></a><button class="tq-exact-hotspot tq-exact-copy" type="button" aria-label="Copy Store Link"></button>`;
      exactHeroWrap.appendChild(exactHotspots);
      exactHotspots.querySelector('.tq-exact-copy')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('https://tequila.tebex.io/');}catch(e){}});
    }'''
    if anchor not in index:
        raise SystemExit('Could not find premium DOM marker in index.html')
    index = index.replace(anchor, hotspot_patch, 1)

index_path.write_text(index, encoding='utf-8')
print('Exact hero display patch applied')
