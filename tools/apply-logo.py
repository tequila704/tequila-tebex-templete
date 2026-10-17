from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

old = '.brand-mark{width:48px!important;height:48px!important;border-radius:15px!important;background:linear-gradient(145deg,#d8fbff,#16e7ff 42%,#5f7cff 72%,#1a2540)!important;color:#00131a!important;border:1px solid rgba(255,255,255,.28)!important;box-shadow:0 0 0 1px rgba(22,231,255,.12),0 0 30px rgba(22,231,255,.20)!important;position:relative;overflow:hidden}'
new = '.brand-mark{width:64px!important;height:64px!important;border-radius:17px!important;background:#04070a url("assets/tequila-logo.webp?v=20261017-logo") center/cover no-repeat!important;color:transparent!important;font-size:0!important;border:1px solid rgba(255,77,188,.55)!important;box-shadow:0 0 0 1px rgba(246,199,94,.12),0 0 28px rgba(255,77,188,.18),0 0 18px rgba(246,199,94,.10)!important;position:relative;overflow:hidden;flex:0 0 64px!important}'

if old in text:
    text = text.replace(old, new, 1)
else:
    print('Desktop brand-mark rule already changed or not found.')

old_after = '.brand-mark:after{content:"";position:absolute;inset:1px;border:1px solid rgba(255,255,255,.16);border-radius:13px}'
new_after = '.brand-mark:after{content:"";position:absolute;inset:1px;border:1px solid rgba(255,255,255,.10);border-radius:15px;pointer-events:none}'
if old_after in text:
    text = text.replace(old_after, new_after, 1)

old_mobile = '.brand-mark{width:44px!important;height:44px!important}'
new_mobile = '.brand-mark{width:54px!important;height:54px!important;flex-basis:54px!important}'
if old_mobile in text:
    text = text.replace(old_mobile, new_mobile, 1)

path.write_text(text, encoding='utf-8')
print('Header logo patch applied.')
