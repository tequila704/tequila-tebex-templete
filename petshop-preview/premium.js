const retrieverPhoto = "https://upload.wikimedia.org/wikipedia/commons/d/d3/GoldenRetriever.jpg";
const pets = [
['a_c_retriever','Retriever',400,1,1,4],['a_c_shepherdt','Shepherd',400,1,1,4],['bulldog','Frenchie',350,0,1,4],['yorkshire','Yorkie',350,0,1,4],['abdog','Bully',400,1,1,4],['ft-pitbull2','Pitbull',400,1,1,4],['a_c_rottweiler','Rottweiler',500,1,1,3],['a_c_pug','Pug',350,0,1,4],['a_c_husky','Husky',400,1,1,3],['a_c_poodle','Poodle',350,0,1,1],['a_c_westy','Westie',350,0,1,3],['a_c_shepherd','Shepard',400,1,1,3],['a_c_cat_01','Cat',400,0,0,3],['a_c_rabbit_01','Rabbit',250,0,0,3],['a_c_pig','Pig',250,0,0,1],['a_c_cow','Cow',250,0,0,1],['Younghorse','Young Horse',250,0,0,1],['Rangehorse','Range Horse',250,0,0,1],['Fullhorse','Full Breed Horse',250,0,0,1],['Donkey','Donkey',250,0,0,1],['a_c_rat','Rat',150,0,0,4],['a_c_boar','Boar',250,0,0,1],['a_c_hen','Hen',250,0,0,1],['a_c_deer','Deer',250,0,0,1],['a_c_chimp','Chimp',250,1,0,1],['a_c_rhesus','Ape',250,1,0,1],['a_c_mtlion','Lion',250,1,0,1],['a_c_armadillo','Armadillo',200,0,0,1],['chowchow','Chow Chow',450,1,1,1],['a_c_cockroach','Cockroach',50,0,0,1],['a_c_dalmatian','Dalmatian',450,1,1,1],['doberman','Doberman',500,1,1,1],['a_c_k9','K9',500,1,1,1],['robot_dog','Robot Dog',1000,1,1,1],['a_c_tarantula','Tarantula',150,0,0,1],['pitbull','Pitbull',400,1,1,1],['yorkie_puppy','Yorkie Puppy',300,0,1,1],['corsopuppy','Corso Puppy',300,0,1,1],['cdev_cat_amer','American Cat',450,0,0,1],['cdev_cat_synphix','Sphynx Cat',500,0,0,1],['cdev_cat_turk','Turkish Cat',500,0,0,1],['cdev_cat_wcoon','Wild Coon Cat',500,0,0,1],['cdev_cat_wolf','Wolf Cat',550,0,0,1],['cdev_dog_bichon','Bichon',500,0,1,1],['cdev_dog_dalpup','Dalmatian Puppy',500,1,1,1],['cdev_dog_pup','Custom Puppy',500,1,1,1],['cdev_dog_shepup','Shepherd Puppy',550,1,1,1]
].map(x=>({model:x[0],label:x[1],price:x[2],attack:!!x[3],sniff:!!x[4],variations:x[5]}));

const desc = {
Retriever:'The Retriever is a friendly and versatile dog breed known for its intelligence and gentle nature. Renowned for retrieving skills, these dogs excel in hunting, service work, and family life.',
Rottweiler:'The Rottweiler is a robust, loyal, and intelligent breed known for protective instincts and a strong build.',
Pug:'The Pug is a small, charming dog breed with a distinctive wrinkled face and curled tail.',
Husky:'The Husky is a medium-sized working dog known for its striking appearance, friendly demeanor, and endurance.',
Poodle:'The Poodle is a highly intelligent and elegant dog breed known for its curly coat.',
Westie:'The West Highland White Terrier is a small, confident dog known for its white coat and lively personality.',
Shepard:'The German Shepherd is a large, strong and intelligent dog breed known for versatility and loyalty.',
Shepherd:'The German Shepherd is a loyal working dog known for intelligence, confidence and versatility.',
Cat:'The domestic cat is a small companion animal valued for independence, curiosity and hunting instincts.',
Rabbit:'Rabbits are charming small mammals with long ears, fluffy tails and a gentle demeanor.',
Rat:'Rats are small intelligent rodents known for adaptability and sociable behavior.',
Boar:'Boars are robust mammals known for their sturdy build, tusks and coarse fur.',
Hen:'Hens are small to medium-sized birds known for their gentle nature and egg-laying ability.',
Donkey:'Donkeys are sturdy sociable mammals known for strength, endurance and their distinctive bray.',
Cow:'Cows are large gentle mammals commonly associated with agriculture and companionship.',
Pig:'Pigs are intelligent sociable mammals known for their snouts, curly tails and foraging ability.',
Lion:'The mountain lion is a large powerful wild cat known for strength, agility and stealth.',
Chimp:'Chimpanzees are intelligent social primates known for expressive faces and tool-making ability.',
Ape:'Rhesus macaques are intelligent adaptable primates known for agility and expressive behavior.',
Deer:'Deer are graceful mammals known for slender builds, antlers and agility.'
};

let idx=0, variation=0, payment='cash', petName='', rotation=0, zoom=62;
const infoPanel=document.getElementById('infoPanel');
const petStage=document.getElementById('petStage');
const petItems=document.getElementById('petItems');

function glyph(p){
  if(p.model.includes('cat')||p.label.includes('Cat')) return '🐈';
  if(p.model.toLowerCase().includes('horse')||p.label==='Donkey') return '🐎';
  const map={Pig:'🐖',Cow:'🐄',Boar:'🐗',Hen:'🐔',Rabbit:'🐇',Rat:'🐀',Deer:'🦌',Chimp:'🐒',Ape:'🐒',Lion:'🐆',Cockroach:'🪳',Tarantula:'🕷️',Armadillo:'🐾'};
  return map[p.label]||'🐕';
}
function description(p){return desc[p.label]||`${p.label} is available from the Tequila Pets premium catalog.`}
function petImage(p, cls){
  if(p.label==='Retriever') return `<img class="${cls}" src="${retrieverPhoto}" alt="Retriever preview">`;
  return `<div class="${cls==='stagePhoto'?'stageGlyph':'cardGlyph'}">${glyph(p)}</div>`;
}
function renderInfo(){
  const p=pets[idx];
  variation=Math.min(variation,p.variations-1);
  infoPanel.innerHTML=`
    <div class="eyebrow">${p.model.includes('cat')?'Cat':'Pet'} Breed</div>
    <div class="petHead">
      <div class="petThumb">${p.label==='Retriever'?`<img src="${retrieverPhoto}" alt="">`:`<div class="petThumbGlyph">${glyph(p)}</div>`}</div>
      <div class="petNameWrap">
        <div class="petName">${p.label}</div>
        <div class="petModel">${p.model}</div>
      </div>
    </div>
    <div class="divider"></div>
    <p class="description">${description(p)}</p>
    <div class="abilityRow">
      <span class="ability ${p.sniff?'on':''}">Sniff ${p.sniff?'Enabled':'Unavailable'}</span>
      <span class="ability ${p.attack?'on':''}">Attack ${p.attack?'Enabled':'Unavailable'}</span>
      <span class="ability on">${p.variations} Variation${p.variations===1?'':'s'}</span>
    </div>
    <div class="controlLine"></div>
    <div class="variationBlock">
      <div><div class="variationLabel">Variation</div><span class="variationHint">Cycle available pet variations</span></div>
      <div class="stepper">
        <button id="prevVariation" aria-label="Previous variation">‹</button>
        <div class="variationValue">${variation}</div>
        <button id="nextVariation" aria-label="Next variation">›</button>
      </div>
    </div>
    <button class="purchase" id="purchase">
      <span class="purchaseInner"><span class="cartIcon">◈</span><span>PURCHASE <span class="price">(${p.price} €)</span></span><span class="buyArrow">›</span></span>
    </button>`;
  document.getElementById('prevVariation').onclick=()=>{variation=(variation-1+p.variations)%p.variations;renderInfo()};
  document.getElementById('nextVariation').onclick=()=>{variation=(variation+1)%p.variations;renderInfo()};
  document.getElementById('purchase').onclick=paymentDialog;
}
function renderStage(){
  const p=pets[idx];
  petStage.innerHTML=petImage(p,'stagePhoto');
  applyTransform();
}
function renderCarousel(){
  petItems.innerHTML=pets.map((p,i)=>`
    <div class="petCard ${i===idx?'active':''}" data-i="${i}" title="${p.label}">
      ${p.label==='Retriever'?`<img class="cardPhoto" src="${retrieverPhoto}" alt="">`:`<div class="cardGlyph">${glyph(p)}</div>`}
      <div class="cardLabel">${p.label}</div>
    </div>`).join('');
  document.querySelectorAll('.petCard').forEach(el=>el.onclick=()=>selectPet(+el.dataset.i,true));
}
function selectPet(i,scroll){
  idx=(i+pets.length)%pets.length;variation=0;rotation=0;renderInfo();renderStage();renderCarousel();
  if(scroll) document.querySelector(`.petCard[data-i="${idx}"]`)?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function applyTransform(){
  const scale=.72+(zoom/100)*.48;
  petStage.style.transform=`rotateY(${rotation}deg) scale(${scale})`;
}
document.getElementById('scrollLeft').onclick=()=>selectPet(idx-1,true);
document.getElementById('scrollRight').onclick=()=>selectPet(idx+1,true);

const zoomSlider=document.getElementById('zoom');
const zoomValue=document.getElementById('zoomValue');
const zoomFill=document.getElementById('zoomFill');
function updateZoom(){
  zoom=+zoomSlider.value; zoomValue.textContent=zoom+'%';
  const pct=(zoom-30)/70;
  zoomFill.style.height=(2.2+13.2*pct)+'vh';
  applyTransform();
}
zoomSlider.addEventListener('input',updateZoom);

let dragging=false,lastX=0;
petStage.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;petStage.classList.add('grabbing');petStage.setPointerCapture(e.pointerId)});
petStage.addEventListener('pointermove',e=>{if(!dragging)return;rotation+=(e.clientX-lastX)*.42;lastX=e.clientX;applyTransform()});
petStage.addEventListener('pointerup',()=>{dragging=false;petStage.classList.remove('grabbing')});
petStage.addEventListener('pointercancel',()=>{dragging=false;petStage.classList.remove('grabbing')});

function openDialog(title,kicker,descText,body,buttons){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="dialogLayer" id="dialogLayer">
      <div class="dialog">
        <div class="dialogTop">
          <div><div class="dialogKicker">${kicker}</div><div class="dialogTitle">${title}</div></div>
          <button class="dialogClose" onclick="closeDialog()" aria-label="Close">×</button>
        </div>
        <div class="dialogDesc">${descText}</div>
        ${body||''}
        ${buttons?`<div class="dialogButtons">${buttons}</div>`:''}
      </div>
    </div>`);
  document.getElementById('dialogLayer').addEventListener('mousedown',e=>{if(e.target.id==='dialogLayer')closeDialog()});
}
function closeDialog(){document.getElementById('dialogLayer')?.remove()}
function paymentDialog(){
  const p=pets[idx];
  openDialog('Choose payment','Secure checkout',`Purchase <b style="color:#fff">${p.label}</b> for <b style="color:#ffe0a4">${p.price} €</b>. Select how you want to pay.`,
  `<div class="payGrid">
    <button class="payCard" onclick="choosePay('cash')"><div class="payIcon">◆</div><div class="payName">Cash</div><div class="payText">Pay using cash on hand</div></button>
    <button class="payCard" onclick="choosePay('card')"><div class="payIcon">▣</div><div class="payName">Card</div><div class="payText">Pay from your account</div></button>
  </div>`,'');
}
function choosePay(v){
  payment=v;closeDialog();
  openDialog('Name your pet','Pet registration','Choose a name for your new companion.',
    `<input class="dialogInput" id="petNameInput" maxlength="24" placeholder="Enter pet name" autofocus>`,
    `<button class="action" onclick="closeDialog()">Cancel</button><button class="action cyan" onclick="confirmName()">Continue</button>`);
  setTimeout(()=>document.getElementById('petNameInput')?.focus(),50);
}
function confirmName(){
  petName=(document.getElementById('petNameInput')?.value||'My Pet').trim()||'My Pet';
  closeDialog(); const p=pets[idx];
  openDialog('Confirm purchase','Final review','Make sure everything looks right before you confirm.',
    `<div class="summaryBox"><span>Pet</span><b>${p.label}</b><span>Name</span><b>${escapeHtml(petName)}</b><span>Variation</span><b>${variation}</b><span>Payment</span><b>${payment==='cash'?'Cash':'Card'}</b><span>Total</span><b style="color:#ffe0a4">${p.price} €</b></div>`,
    `<button class="action" onclick="closeDialog()">Back</button><button class="action gold" onclick="finishBuy()">Confirm purchase</button>`);
}
function finishBuy(){
  const p=pets[idx];closeDialog();showToast(`${petName} • ${p.label} • ${p.price} € • ${payment==='cash'?'Cash':'Card'}`);
}
function showToast(text){
  const t=document.getElementById('toast');t.textContent='PURCHASE PREVIEW — '+text;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),3200);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDialog();if(e.key==='ArrowLeft'&&!document.getElementById('dialogLayer'))selectPet(idx-1,true);if(e.key==='ArrowRight'&&!document.getElementById('dialogLayer'))selectPet(idx+1,true)});

renderInfo();renderStage();renderCarousel();updateZoom();