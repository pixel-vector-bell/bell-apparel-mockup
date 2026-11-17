/* ---------- Sample data (illustrative only; real data comes from SanMar / S&S APIs) ---------- */
const C = {
  white:['White','#fafafa'], black:['Black','#1d1d22'], navy:['Navy','#1f2a52'], royal:['Royal','#2747b8'],
  red:['Red','#c8202f'], maroon:['Maroon','#6b1f2e'], forest:['Forest','#1f5a3a'], gold:['Gold','#f2b71f'],
  ash:['Sport Grey','#b9bcc4'], charcoal:['Charcoal','#45474f'], orange:['Orange','#ea6a1f'], purple:['Purple','#4f2c84'],
  sand:['Sand','#d9c7a3'], pepper:['Pepper','#5b5b5b'], blossom:['Blossom','#f3b7c7'],
};
const pick = (...k) => k.map(x => ({ key:x, name:C[x][0], hex:C[x][1] }));

const Z = {
  tee: {
    front:[
      {id:'ff', name:'Full front', x:33,y:29,w:34,h:36, maxIn:'12" × 14"', methods:['sp','dtf']},
      {id:'lc', name:'Left chest', x:56,y:29,w:12,h:11, maxIn:'4" × 4"', methods:['sp','emb','dtf']},
      {id:'rc', name:'Right chest', x:32,y:29,w:12,h:11, maxIn:'4" × 4"', methods:['emb','dtf']},
      {id:'ls', name:'Left sleeve', x:80,y:26,w:9,h:9, maxIn:'3" × 3"', methods:['sp','emb']},
    ],
    back:[
      {id:'fb', name:'Full back', x:33,y:24,w:34,h:42, maxIn:'12" × 16"', methods:['sp','dtf']},
      {id:'bn', name:'Back neck', x:42,y:15,w:16,h:6, maxIn:'4" × 1.5"', methods:['sp','emb','dtf']},
    ]
  },
  hat: { front:[{id:'hf', name:'Front panel', x:36,y:36,w:28,h:16, maxIn:'4.5" × 2.25"', methods:['emb']}],
         back:[{id:'hb', name:'Back arch', x:40,y:52,w:20,h:7, maxIn:'2.5" × 1"', methods:['emb']}] },
};

const PRODUCTS = [
  {id:'g5000', style:'5000', brand:'Gildan', name:'Heavy Cotton T-Shirt', vendor:'S&S', cat:'T-shirts', type:'tee', cost:2.92, popular:1, sold:4120,
   colors:pick('white','black','navy','royal','red','maroon','forest','gold','ash','orange','purple'), desc:'5.3 oz, 100% cotton. The go-to for spirit wear, events, and teams.'},
  {id:'pc54', style:'PC54', brand:'Port & Company', name:'Core Cotton Tee', vendor:'SanMar', cat:'T-shirts', type:'tee', cost:3.06, popular:1, sold:2980,
   colors:pick('white','black','navy','royal','red','ash','charcoal','forest'), desc:'5.4 oz, 100% cotton. Budget-friendly classic.'},
  {id:'bc3001', style:'3001', brand:'Bella+Canvas', name:'Unisex Jersey Tee', vendor:'S&S', cat:'T-shirts', type:'tee', cost:3.98, popular:1, sold:2410,
   colors:pick('white','black','navy','charcoal','maroon','sand','blossom'), desc:'4.2 oz, soft retail fit. Great for retail and staff shirts.'},
  {id:'g18500', style:'18500', brand:'Gildan', name:'Heavy Blend Hooded Sweatshirt', vendor:'S&S', cat:'Hoodies & sweats', type:'hoodie', cost:11.48, popular:1, sold:1860,
   colors:pick('black','navy','royal','red','maroon','ash','charcoal','forest','gold'), desc:'8 oz, 50/50 blend. Our best-selling hoodie.'},
  {id:'st350', style:'ST350', brand:'Sport-Tek', name:'PosiCharge Competitor Tee', vendor:'SanMar', cat:'Performance', type:'tee', cost:5.24, popular:1, sold:1530,
   colors:pick('white','black','navy','royal','red','gold','orange','purple','forest'), desc:'3.8 oz moisture-wicking polyester. Ideal for teams and PE.'},
  {id:'k500', style:'K500', brand:'Port Authority', name:'Silk Touch Polo', vendor:'SanMar', cat:'Polos', type:'polo', cost:12.62, popular:1, sold:980,
   colors:pick('white','black','navy','royal','red','maroon','forest'), desc:'5 oz, wrinkle resistant. Staff and coaches polo.'},
  {id:'r112', style:'112', brand:'Richardson', name:'Trucker Snapback Cap', vendor:'S&S', cat:'Hats', type:'hat', cost:5.86, popular:1, sold:870,
   colors:pick('black','navy','charcoal','red','royal'), desc:'Classic structured trucker. Embroidery only.'},
  {id:'cc1717', style:'1717', brand:'Comfort Colors', name:'Garment-Dyed Heavyweight Tee', vendor:'S&S', cat:'T-shirts', type:'tee', cost:6.42, popular:1, sold:760,
   colors:pick('white','black','navy','sand','blossom','pepper','maroon'), desc:'6.1 oz ring-spun cotton, vintage washed look.'},
  {id:'g18000', style:'18000', brand:'Gildan', name:'Heavy Blend Crewneck Sweatshirt', vendor:'S&S', cat:'Hoodies & sweats', type:'crew', cost:8.96, popular:0, sold:540,
   colors:pick('black','navy','ash','maroon','forest','gold'), desc:'8 oz, 50/50 blend crewneck.'},
  {id:'pc78h', style:'PC78H', brand:'Port & Company', name:'Core Fleece Pullover Hoodie', vendor:'SanMar', cat:'Hoodies & sweats', type:'hoodie', cost:13.40, popular:0, sold:410,
   colors:pick('black','navy','royal','red','ash','charcoal'), desc:'7.8 oz fleece pullover hoodie.'},
  {id:'st850', style:'ST850', brand:'Sport-Tek', name:'Sport-Wick Stretch 1/4-Zip', vendor:'SanMar', cat:'Performance', type:'qzip', cost:17.88, popular:0, sold:300,
   colors:pick('black','navy','charcoal','royal'), desc:'Lightweight stretch 1/4-zip for coaches and staff.'},
  {id:'dt6000', style:'DT6000', brand:'District', name:'Very Important Tee', vendor:'SanMar', cat:'T-shirts', type:'tee', cost:4.10, popular:0, sold:280,
   colors:pick('white','black','navy','charcoal','royal','maroon'), desc:'4.3 oz ring-spun cotton, fashion fit.'},
];
const SIZES = ['YS','YM','YL','S','M','L','XL','2XL','3XL'];
const UPCHARGE = {'2XL':2.00,'3XL':3.00};

const METHODS = { sp:'Screen print', emb:'Embroidery', dtf:'Full-color transfer (DTF)' };
const TIERS = [1,12,24,48,72,144];
const TIER_LBL = ['1–11','12–23','24–47','48–71','72–143','144+'];
// per piece, per location
const SP = [null,[3.50,4.25,5.00,5.75,6.50,7.25],[2.40,2.95,3.50,4.05,4.60,5.15],[1.75,2.15,2.55,2.95,3.35,3.75],[1.40,1.75,2.10,2.45,2.80,3.15],[1.05,1.30,1.55,1.80,2.05,2.30]];
const EMB = [9.50,7.50,6.25,5.25,4.75,4.25];
const DTF_S = [6.00,4.50,3.75,3.25,3.00,2.75];
const DTF_L = [10.50,8.00,6.75,6.00,5.50,5.00];
const MARKUP = { retail:1.00, school:0.60, rep:0.75, floor:0.40 };
const SETUP = { screen:25, digitize:45, design:50 };

const CUSTOMERS = [
  {id:'tv', name:'Timpview High School', sub:'Football + Athletics', tier:'school', rep:'Kayla M.', colors:'Navy / Gold', logos:2, lastOrder:'2026-10-02'},
  {id:'ls', name:'Lone Peak High School', sub:'PTSA + Spirit', tier:'school', rep:'Kayla M.', colors:'Black / Gold', logos:3, lastOrder:'2026-09-21'},
  {id:'ae', name:'American Fork Elementary', sub:'Field day', tier:'school', rep:'Derek S.', colors:'Royal / Red', logos:1, lastOrder:'2026-05-11'},
  {id:'ut', name:'Utah Valley Youth Soccer', sub:'Rec league', tier:'school', rep:'Derek S.', colors:'Red / White', logos:1, lastOrder:'2026-08-30'},
  {id:'mc', name:'Mountain Credit Union', sub:'Corporate', tier:'retail', rep:'Kayla M.', colors:'Forest / White', logos:1, lastOrder:'2026-07-14'},
];

function tierIdx(q){ let i=0; TIERS.forEach((t,k)=>{ if(q>=t) i=k; }); return i; }
function money(n){ return '$'+(Math.round(n*100)/100).toFixed(2); }
function money0(n){ return '$'+Math.round(n).toLocaleString(); }

/** price one decoration location, per piece, at a quantity */
function decoPrice(loc, q){
  const i = tierIdx(q);
  if(loc.method==='sp'){ const row = SP[i] || SP[1]; return row[Math.min(Math.max(loc.colors||1,1),6)-1]; }
  if(loc.method==='emb') return EMB[i];
  const big = ['ff','fb'].includes(loc.zone);
  return (big?DTF_L:DTF_S)[i];
}
/** full quote for a line */
function quoteLine(p, q, locs, markup){
  const blank = p.cost*(1+markup);
  const deco = locs.reduce((s,l)=>s+decoPrice(l,q),0);
  let setup = 0;
  locs.forEach(l=>{ if(l.method==='sp') setup += SETUP.screen*(l.colors||1); if(l.method==='emb' && !l.onFile) setup += SETUP.digitize; });
  const unit = blank+deco;
  const cost = p.cost + deco*0.45; // est. internal cost: blank + ink/thread/labor
  return { unit, blank, deco, setup, total: unit*q + setup, cost, margin: q? (unit*q+setup - cost*q)/(unit*q+setup) : 0 };
}
