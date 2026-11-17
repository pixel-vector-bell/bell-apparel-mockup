/* ---------- App state + router ---------- */
const S = {
  account: null,            // null = retail guest; 'tv' = signed-in school account
  showAll: false, cat: 'Popular',
  pd: { id:'g5000', color:'navy', view:'front', locs:{ff:{method:'sp',colors:2}}, sizes:{S:4,M:8,L:8,XL:4}, art:'upload' },
  cart: [],
  rep: { cust:'tv', lines:[
      {pid:'g5000', color:'navy', qty:96, locs:[{zone:'ff',method:'sp',colors:2}]},
      {pid:'g18500', color:'navy', qty:36, locs:[{zone:'ff',method:'sp',colors:2},{zone:'ls',method:'sp',colors:1}]},
    ], markup: MARKUP.rep, showCost:true, adding:null },
  zed: { pid:'g5000', view:'front', sel:'ff' },
  des: { view:'front', zone:'ff', els:[{id:1,kind:'text',text:'TIMPVIEW',font:'Impact, sans-serif',size:34,color:'#FFD23C',x:50,y:38},{id:2,kind:'text',text:'FOOTBALL',font:'Impact, sans-serif',size:20,color:'#ffffff',x:50,y:50}], sel:1, pro:false },
};
const $ = s => document.querySelector(s);
const P = id => PRODUCTS.find(p=>p.id===id);
const markupNow = () => S.account ? MARKUP.school : MARKUP.retail;

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2400); }
function go(h){ location.hash = h; }

function mockbar(mode){
  return `<div class="mockbar"><div class="wrap">
    <b>MOCKUP</b><span>Bell Custom Apparel · sample data, prices are placeholders</span>
    <div class="seg">
      <a href="#/" class="${mode==='shop'?'on':''}">Customer site</a>
      <a href="#/rep" class="${mode==='rep'?'on':''}">Sales rep</a>
      <a href="#/admin" class="${mode==='admin'?'on':''}">Employee back office</a>
      <a href="#/plan" class="${mode==='plan'?'on':''}">Project plan</a>
    </div></div></div>`;
}
const LOGO = `<div class="logo"><div class="mark">B</div><div>Bell <span style="color:var(--ink);font-weight:600">Custom Apparel</span></div></div>`;

/* ---------- CUSTOMER SITE ---------- */
function shopHeader(on){
  const acct = S.account ? CUSTOMERS.find(c=>c.id===S.account) : null;
  return `<div class="hdr"><div class="wrap">
    <a href="#/">${LOGO}</a>
    <nav class="nav">
      <a href="#/" class="${on==='home'?'on':''}">Shop</a>
      <a href="#/catalog" class="${on==='cat'?'on':''}">All products</a>
      <a href="#/design" class="${on==='des'?'on':''}">Design studio</a>
      <a href="#/how" class="${on==='how'?'on':''}">How it works</a>
    </nav>
    <div class="right">
      ${acct ? `<span class="tag blue">🏫 ${acct.name} · school pricing</span><button class="btn sm ghost" onclick="S.account=null;render()">Sign out</button>`
             : `<button class="btn sm" onclick="S.account='tv';toast('Signed in as Timpview High School (demo)');render()">Customer sign in</button>`}
      <a class="btn sm pri" href="#/cart">🛒 Cart (${S.cart.length})</a>
    </div></div></div>`;
}
function pcard(p){
  const r = quoteLine(p, 24, [{zone:'ff',method:'sp',colors:1}], markupNow());
  const c = p.colors[Math.min(1,p.colors.length-1)];
  return `<div class="pcard" onclick="S.pd.id='${p.id}';S.pd.color='${c.key}';S.pd.view='front';S.pd.locs=${p.type==='hat'?"{hf:{method:'emb'}}":"{ff:{method:'sp',colors:1}}"};go('#/product/${p.id}')">
    <div class="img">${p.popular?'<span class="tag">★ Popular</span>':''}${garment(p.type,c.hex,'front',170)}</div>
    <div class="body"><div class="small muted">${p.brand} ${p.style}</div><div class="name">${p.name}</div>
      <div class="dots">${p.colors.slice(0,8).map(c=>`<i style="background:${c.hex}" title="${c.name}"></i>`).join('')}${p.colors.length>8?`<span class="tiny muted">+${p.colors.length-8}</span>`:''}</div>
      <div class="from">${p.type==='hat'?'Embroidered from ':'From '}${money(p.type==='hat'?quoteLine(p,24,[{zone:'hf',method:'emb'}],markupNow()).unit:r.unit)} <span class="tiny muted" style="font-weight:500">ea. at 24+, 1-color print</span></div>
    </div></div>`;
}
function home(){
  const acct = S.account ? CUSTOMERS.find(c=>c.id===S.account) : null;
  const pop = PRODUCTS.filter(p=>p.popular).sort((a,b)=>b.sold-a.sold);
  return `${shopHeader('home')}
  <section class="hero"><div class="wrap">
    <div>
      <span class="tag">Utah County's school + team print shop</span>
      <h1 style="margin-top:14px">Custom shirts, hoodies, and hats with instant pricing.</h1>
      <p>Pick a product, add your logo, and see your real price before you order. Upload your art, design it yourself, or have our team design it for you.</p>
      <div class="ctas"><a class="btn gold" href="#/catalog">Start shopping</a><a class="btn" href="#/product/g5000">Get an instant quote</a></div>
    </div>
    <div class="art">${garment('hoodie','#1f2a52','front',230)}<div style="margin-left:-60px;margin-top:60px">${garment('tee','#FFD23C','front',200)}</div></div>
  </div></section>
  <div class="wrap">
    <div class="paths">
      <div class="path"><div class="ic">⬆️</div><h3>Upload your art</h3><div class="muted small">Send a logo file. We check it and email a proof before we print.</div></div>
      <div class="path"><div class="ic">✏️</div><h3>Design it yourself</h3><div class="muted small">Add text, clip art, and your logo in our online design studio.</div></div>
      <div class="path"><div class="ic">🎨</div><h3>Have us design it</h3><div class="muted small">Tell us your idea. Our artists create it for a flat ${money0(SETUP.design)} design fee.</div></div>
    </div>
    ${acct ? `<section class="section" style="padding-bottom:0"><div class="card" style="display:flex;gap:20px;align-items:center;border-color:#cdd3f4;background:var(--blue-l)">
        <div class="av" style="width:56px;height:56px;font-size:1.4rem;background:var(--blue);color:var(--gold)">T</div>
        <div style="flex:1"><h3 style="margin:0">Welcome back, ${acct.name}</h3><div class="small muted">Your school pricing is applied to every product. Your approved logos (${acct.logos}) are ready to use. Your rep is ${acct.rep}.</div></div>
        <a class="btn pri" href="#/product/g5000">Reorder last shirt</a><a class="btn" href="#/design">Use my logos</a></div></section>`:''}
    <section class="section">
      <div class="sechead"><div><h2>Most popular</h2><div class="muted">What schools and teams order most. Start here.</div></div><a class="btn" href="#/catalog">See all products →</a></div>
      <div class="grid g4">${pop.map(pcard).join('')}</div>
    </section>
    <section class="section" id="how" style="padding-top:0">
      <h2>How it works</h2>
      <div class="steps">
        <div class="step"><div class="n">1</div><h3>Pick a product</h3><div class="small muted">Choose from our most popular items, or browse the full catalog.</div></div>
        <div class="step"><div class="n">2</div><h3>Add your design</h3><div class="small muted">Pick where it goes: front, back, chest, or sleeve.</div></div>
        <div class="step"><div class="n">3</div><h3>See your price</h3><div class="small muted">Prices update instantly as you change sizes and quantities. Bigger orders cost less per piece.</div></div>
        <div class="step"><div class="n">4</div><h3>Approve your proof</h3><div class="small muted">We email a proof. After you approve it, we print and ship in about 10 business days.</div></div>
      </div>
    </section>
  </div>
  <footer class="foot"><div class="wrap flex between"><div>${LOGO.replace('color:var(--ink)','color:#fff')}</div><div>Bell Photographers · Custom Apparel · American Fork, UT</div></div></footer>`;
}
function catalog(){
  const cats = ['Popular','T-shirts','Hoodies & sweats','Performance','Polos','Hats','All'];
  let list = PRODUCTS.slice().sort((a,b)=>b.sold-a.sold);
  if(S.cat==='Popular') list = list.filter(p=>p.popular);
  else if(S.cat!=='All') list = list.filter(p=>p.cat===S.cat);
  return `${shopHeader('cat')}<div class="wrap">
    <div class="crumbs">Shop / All products</div>
    <div class="sechead"><div><h1 style="font-size:2rem">Products</h1><div class="muted">We show our popular picks first. The full SanMar and S&S catalogs (thousands of styles) are available through your rep or by search.</div></div>
      <input type="search" placeholder="Search style # or name (try PC54)" style="width:300px" oninput="toast('Search hits the live vendor catalog in the real build')"></div>
    <div class="chips" style="margin-bottom:20px">${cats.map(c=>`<button class="chip ${S.cat===c?'on':''}" onclick="S.cat='${c}';render()">${c}</button>`).join('')}</div>
    <div class="grid g4">${list.map(pcard).join('')}</div>
    <div class="info" style="margin-top:22px">💡 Can't find it? Our full catalog includes every SanMar and S&S style. <a href="#/how">Ask us</a> and we'll add it to your quote.</div>
  </div>`;
}
function product(id){
  const p = P(id) || P('g5000'); S.pd.id = p.id;
  if(!p.colors.find(c=>c.key===S.pd.color)) S.pd.color = p.colors[0].key;
  const col = p.colors.find(c=>c.key===S.pd.color);
  const zones = zonesFor(p);
  const allZones = [...zones.front, ...zones.back];
  Object.keys(S.pd.locs).forEach(k=>{ if(!allZones.find(z=>z.id===k)) delete S.pd.locs[k]; });
  if(!Object.keys(S.pd.locs).length){ const z0=allZones[0]; S.pd.locs[z0.id]={method:z0.methods[0],colors:1}; }
  const qty = Object.values(S.pd.sizes).reduce((a,b)=>a+(+b||0),0);
  const locs = Object.entries(S.pd.locs).map(([zone,v])=>({zone,...v}));
  const q = quoteLine(p, Math.max(qty,1), locs, markupNow());
  const up = Object.entries(S.pd.sizes).reduce((s,[k,v])=>s+(UPCHARGE[k]||0)*(+v||0),0);
  const design = S.pd.art==='pro' ? SETUP.design : 0;
  const total = q.unit*qty + up + q.setup + design;
  const ti = tierIdx(qty);
  const spUnder = qty<12 && locs.some(l=>l.method==='sp');
  const viewZones = zones[S.pd.view];
  return `${shopHeader('cat')}<div class="wrap">
  <div class="crumbs"><a href="#/">Shop</a> / <a href="#/catalog">${p.cat}</a> / ${p.brand} ${p.style}</div>
  <div class="pd">
    <div class="stage">
      <div class="canvas" id="stage">${garment(p.type,col.hex,S.pd.view,440)}
        ${viewZones.map(z=>{ const on = S.pd.locs[z.id]; return `<div style="position:absolute;left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%;border:2px dashed ${on?'var(--blue)':'rgba(26,43,143,.25)'};background:${on?'rgba(255,210,60,.35)':'transparent'};border-radius:4px;display:grid;place-items:center;font-size:.7rem;font-weight:700;color:var(--blue);cursor:pointer;text-align:center" onclick="toggleLoc('${z.id}')">${on?'YOUR LOGO':''}</div>`;}).join('')}
      </div>
      <div class="views"><button class="btn sm ${S.pd.view==='front'?'pri':''}" onclick="S.pd.view='front';render()">Front</button><button class="btn sm ${S.pd.view==='back'?'pri':''}" onclick="S.pd.view='back';render()">Back</button></div>
      <div class="small muted" style="text-align:center;margin-top:8px">Dashed boxes are the print areas our shop allows on this product. Click one to add it.</div>
    </div>
    <div>
      <div class="small muted">${p.brand} ${p.style} · ${p.vendor==='SanMar'?'Ships from SanMar':'Ships from S&S'}</div>
      <h1 style="font-size:2rem;margin:4px 0 6px">${p.name}</h1>
      <div class="muted" style="margin-bottom:16px">${p.desc}</div>

      <div class="panel"><h3><span class="num">1</span>Color: <span style="font-weight:500">${col.name}</span></h3>
        <div class="swatches">${p.colors.map(c=>`<div class="sw ${c.key===S.pd.color?'on':''}" style="background:${c.hex}" title="${c.name}" onclick="S.pd.color='${c.key}';render()"></div>`).join('')}</div>
        <div class="tiny muted" style="margin-top:8px">✔ In stock at vendor warehouse (live inventory in real build)</div></div>

      <div class="panel"><h3><span class="num">2</span>Where should your design go?</h3>
        <div class="locs">${allZones.map(z=>{ const on=S.pd.locs[z.id]; return `<label class="loc ${on?'on':''}"><input type="checkbox" ${on?'checked':''} onchange="toggleLoc('${z.id}')"><div><div style="font-weight:600">${z.name}</div><div class="tiny muted">up to ${z.maxIn}</div></div></label>`;}).join('')}</div>
        ${locs.map(l=>{ const z=allZones.find(a=>a.id===l.zone); return `<div class="flex" style="margin-top:12px;flex-wrap:wrap"><b style="min-width:110px">${z.name}</b>
          <select onchange="S.pd.locs['${l.zone}'].method=this.value;render()">${z.methods.map(m=>`<option value="${m}" ${l.method===m?'selected':''}>${METHODS[m]}</option>`).join('')}</select>
          ${l.method==='sp'?`<select onchange="S.pd.locs['${l.zone}'].colors=+this.value;render()">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${l.colors===n?'selected':''}>${n} ink color${n>1?'s':''}</option>`).join('')}</select>`:''}
          ${l.method==='emb'?'<span class="tiny muted">Up to 8,000 stitches</span>':''}${l.method==='dtf'?'<span class="tiny muted">Unlimited colors, great for photos</span>':''}</div>`;}).join('')}
        ${spUnder?`<div class="hint" style="margin-top:12px">Screen printing starts at 12 pieces. For smaller orders, choose <b>Full-color transfer</b>.</div>`:''}
      </div>

      <div class="panel"><h3><span class="num">3</span>Artwork</h3>
        <div class="artopts">
          <div class="artopt ${S.pd.art==='upload'?'on':''}" onclick="S.pd.art='upload';render()"><div class="ic">⬆️</div><b>Upload art</b><div class="tiny muted">PNG, PDF, AI, or EPS</div></div>
          <div class="artopt ${S.pd.art==='diy'?'on':''}" onclick="go('#/design')"><div class="ic">✏️</div><b>Design it myself</b><div class="tiny muted">Open design studio</div></div>
          <div class="artopt ${S.pd.art==='pro'?'on':''}" onclick="S.pd.art='pro';render()"><div class="ic">🎨</div><b>Bell designs it</b><div class="tiny muted">+${money0(SETUP.design)} flat fee</div></div>
        </div>
        ${S.pd.art==='upload'?`<label class="btn block" style="margin-top:12px;border-style:dashed">📎 Choose file or drag it here<input type="file" style="display:none" onchange="toast('Uploaded '+this.files[0].name+'. Our art team checks it before printing.')"></label>`:''}
        ${S.pd.art==='pro'?`<textarea placeholder="Describe your idea: team name, mascot, colors, any text…" style="width:100%;margin-top:12px" rows="3"></textarea>`:''}
        ${S.account?`<div class="info" style="margin-top:12px">🏫 Or use one of your school's approved logos: <b>Timpview T Logo</b>, <b>Thunderbirds Script</b></div>`:''}
      </div>

      <div class="panel"><h3><span class="num">4</span>Sizes and quantities</h3>
        <div class="sizes" style="grid-template-columns:repeat(${SIZES.length},1fr)">${SIZES.map(s=>`<label>${s}${UPCHARGE[s]?`<span class="tiny">+${money0(UPCHARGE[s])}</span>`:'<span class="tiny">&nbsp;</span>'}<input type="number" min="0" value="${S.pd.sizes[s]||''}" placeholder="0" onchange="S.pd.sizes['${s}']=+this.value;render()"></label>`).join('')}</div>
      </div>

      <div class="pricebox">
        <div class="flex between"><div><div class="small" style="color:#d6dbff">Your price${S.account?' (school pricing)':''}</div><div class="big">${money(q.unit)} <span style="font-size:1rem;font-weight:500">each</span></div></div>
        <div style="text-align:right"><div class="small" style="color:#d6dbff">${qty} pieces</div><div style="font-size:1.5rem;font-weight:800">${money(total)}</div></div></div>
        <div class="small" style="margin-top:10px;color:#d6dbff">Order more, save more (price each):</div>
        <div class="tiers" style="grid-template-columns:repeat(${TIERS.length},1fr)">${TIERS.map((t,i)=>{ const v=quoteLine(p,t,locs,markupNow()).unit; const na = i===0 && locs.some(l=>l.method==='sp'); return `<div class="${i===ti?'on':''}">${TIER_LBL[i]}<b>${na?'—':money(v)}</b></div>`;}).join('')}</div>
        <div class="row"><span>Product + decoration × ${qty}</span><span>${money(q.unit*qty)}</span></div>
        ${up?`<div class="row"><span>2XL+ size upcharges</span><span>${money(up)}</span></div>`:''}
        ${q.setup?`<div class="row"><span>One-time setup (screens / digitizing)</span><span>${money(q.setup)}</span></div>`:''}
        ${design?`<div class="row"><span>Design service</span><span>${money(design)}</span></div>`:''}
        <div class="flex" style="margin-top:14px"><button class="btn gold" style="flex:1" ${spUnder||!qty?'disabled':''} onclick="S.cart.push({p:'${p.id}',qty:${qty},total:${total.toFixed(2)}});toast('Added to cart');render()">Add to cart</button><button class="btn" onclick="toast('Quote saved and emailed (demo)')">Email me this quote</button></div>
      </div>
      <div class="small muted" style="margin:10px 0 40px">Estimated ship date: 10 business days after you approve your proof. Rush available.</div>
    </div>
  </div></div>`;
}
function toggleLoc(id){
  const p = P(S.pd.id); const z = [...zonesFor(p).front,...zonesFor(p).back].find(a=>a.id===id);
  if(S.pd.locs[id]) delete S.pd.locs[id];
  else S.pd.locs[id] = { method:z.methods[0], colors:1 };
  render();
}
function cart(){
  return `${shopHeader('')}<div class="wrap" style="max-width:820px"><div class="crumbs">Shop / Cart</div><h1 style="font-size:2rem">Cart</h1>
  ${S.cart.length? `<div class="card"><table class="t"><tr><th>Item</th><th class="num">Qty</th><th class="num">Total</th></tr>
    ${S.cart.map(c=>{const p=P(c.p);return `<tr><td><div class="flex"><div class="mini">${garment(p.type,p.colors[0].hex,'front',38)}</div>${p.brand} ${p.style} ${p.name}</div></td><td class="num">${c.qty}</td><td class="num">${money(c.total)}</td></tr>`}).join('')}
    </table><div class="flex between" style="margin-top:14px"><b>Total ${money(S.cart.reduce((s,c)=>s+c.total,0))}</b><button class="btn gold" onclick="toast('Checkout uses Stripe or similar in the real build')">Checkout</button></div></div>`
  : `<div class="card muted">Your cart is empty. <a href="#/">Start shopping</a>.</div>`}</div>`;
}


/* ---------- DESIGN STUDIO ---------- */
function designer(){
  const p = P(S.pd.id); const col = p.colors.find(c=>c.key===S.pd.color) || p.colors[0];
  const zones = zonesFor(p)[S.des.view];
  const z = zones.find(a=>a.id===S.des.zone) || zones[0]; S.des.zone = z.id;
  const sel = S.des.els.find(e=>e.id===S.des.sel);
  return `${shopHeader('des')}<div class="wrap"><div class="crumbs"><a href="#/product/${p.id}">← Back to ${p.brand} ${p.style}</a></div>
  <div class="designer">
    <div>
      <div class="card"><h3>Add to your design</h3>
        <button class="tool" onclick="addText()">🔤 <div><b>Add text</b><div class="tiny muted">Team names, numbers, slogans</div></div></button>
        <label class="tool" style="cursor:pointer">⬆️ <div><b>Upload image</b><div class="tiny muted">Your logo or artwork</div></div><input type="file" accept="image/*" style="display:none" onchange="addImg(this)"></label>
        <button class="tool" onclick="addClip()">⭐ <div><b>Clip art</b><div class="tiny muted">Mascots, sports, icons</div></div></button>
        ${S.account?`<button class="tool" onclick="addClip('🦅')">🏫 <div><b>My school logos</b><div class="tiny muted">Approved Timpview logos</div></div></button>`:''}
      </div>
      <div class="card" style="margin-top:14px"><h3>Print area</h3>
        <div class="flex" style="margin-bottom:10px"><button class="btn sm ${S.des.view==='front'?'pri':''}" onclick="S.des.view='front';S.des.zone=zonesFor(P(S.pd.id)).front[0].id;render()">Front</button><button class="btn sm ${S.des.view==='back'?'pri':''}" onclick="S.des.view='back';S.des.zone=zonesFor(P(S.pd.id)).back[0].id;render()">Back</button></div>
        <select style="width:100%" onchange="S.des.zone=this.value;render()">${zones.map(a=>`<option value="${a.id}" ${a.id===z.id?'selected':''}>${a.name} (max ${a.maxIn})</option>`).join('')}</select>
        <div class="tiny muted" style="margin-top:8px">Your design stays inside the dashed box. Our staff sets these areas per product.</div>
      </div>
    </div>
    <div class="card" style="padding:14px">
      <div class="dcanvas" id="dcanvas">
        <svg class="shirt" viewBox="0 0 200 200">${garment(p.type,col.hex,S.des.view,200).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>
        <div class="pz" id="pz" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%"><span class="lab">${z.name}</span></div>
        ${S.des.els.map(e=> e.kind==='img'
          ? `<img class="el ${e.id===S.des.sel?'sel':''}" data-id="${e.id}" src="${e.src}" style="left:${e.x}%;top:${e.y}%;width:${e.size*2.2}px;transform:translate(-50%,-50%)">`
          : `<div class="el ${e.id===S.des.sel?'sel':''}" data-id="${e.id}" style="left:${e.x}%;top:${e.y}%;font-family:${e.font};font-size:${e.size}px;color:${e.color};transform:translate(-50%,-50%);text-shadow:0 1px 0 rgba(0,0,0,.25)">${e.text}</div>`).join('')}
      </div>
      <div class="flex between small muted" style="margin-top:10px"><span>Drag items to move them. ${p.brand} ${p.style} in ${col.name}.</span><span>${S.des.els.length} item(s)</span></div>
    </div>
    <div>
      <div class="card"><h3>Selected item</h3>
        ${sel ? (sel.kind==='img' ? `<div class="field">Size<input type="range" min="10" max="60" value="${sel.size}" onchange="selEl().size=+this.value;render()"></div>`
        : `<div class="col">
            <div class="field">Text<input type="text" value="${sel.text}" oninput="selEl().text=this.value;renderKeep(this)"></div>
            <div class="field">Font<select onchange="selEl().font=this.value;render()">${['Impact, sans-serif','Georgia, serif','Arial Black, sans-serif','Brush Script MT, cursive','Courier New, monospace'].map(f=>`<option value="${f}" ${sel.font===f?'selected':''}>${f.split(',')[0]}</option>`).join('')}</select></div>
            <div class="field">Size<input type="range" min="10" max="60" value="${sel.size}" onchange="selEl().size=+this.value;render()"></div>
            <div class="field">Ink color<div class="swatches">${['#ffffff','#1d1d22','#FFD23C','#1A2B8F','#c8202f','#1f5a3a','#ea6a1f'].map(h=>`<div class="sw ${sel.color===h?'on':''}" style="background:${h}" onclick="selEl().color='${h}';render()"></div>`).join('')}</div></div>
          </div>`) + `<button class="btn sm" style="margin-top:12px" onclick="S.des.els=S.des.els.filter(e=>e.id!==S.des.sel);S.des.sel=null;render()">🗑 Remove</button>`
        : '<div class="muted small">Click an item on the shirt to edit it.</div>'}
      </div>
      <div class="card" style="margin-top:14px">
        <label class="flex" style="cursor:pointer"><span class="toggle ${S.des.pro?'on':''}" onclick="S.des.pro=!S.des.pro;render()"></span><span><b>Have a Bell artist polish it</b><div class="tiny muted">We clean up your design before printing (+${money0(SETUP.design)})</div></span></label>
        <div class="small muted" style="margin:12px 0">Ink colors used: <b>${new Set(S.des.els.filter(e=>e.kind==='text').map(e=>e.color)).size}</b> · This sets your screen-print price.</div>
        <button class="btn gold block" onclick="S.pd.art='diy';toast('Design saved to your cart item');go('#/product/${p.id}')">Save design and see price</button>
      </div>
    </div>
  </div></div>`;
}
const selEl = () => S.des.els.find(e=>e.id===S.des.sel);
function nid(){ return Math.max(0,...S.des.els.map(e=>e.id))+1; }
function zc(){ const z=[...zonesFor(P(S.pd.id)).front,...zonesFor(P(S.pd.id)).back].find(a=>a.id===S.des.zone); return {x:z.x+z.w/2,y:z.y+z.h/2}; }
function addText(){ const c=zc(); const id=nid(); S.des.els.push({id,kind:'text',text:'YOUR TEXT',font:'Impact, sans-serif',size:24,color:'#ffffff',x:c.x,y:c.y}); S.des.sel=id; render(); }
function addClip(ch){ const c=zc(); const id=nid(); const opts=['⭐','🏈','🏀','⚽','🐾','🦅','⚡']; S.des.els.push({id,kind:'text',text:ch||opts[Math.floor(Math.random()*opts.length)],font:'sans-serif',size:40,color:'#000',x:c.x,y:c.y}); S.des.sel=id; render(); }
function addImg(inp){ const f=inp.files[0]; if(!f) return; const c=zc(); const id=nid(); S.des.els.push({id,kind:'img',src:URL.createObjectURL(f),size:30,x:c.x,y:c.y}); S.des.sel=id; render(); }
function renderKeep(input){ const pos=input.selectionStart; render(); const el=document.querySelector('.designer input[type=text]'); if(el){ el.focus(); el.setSelectionRange(pos,pos);} }
function bindDesigner(){
  const cv = $('#dcanvas'); if(!cv) return; const pz = $('#pz');
  cv.querySelectorAll('.el').forEach(el=>{
    el.addEventListener('pointerdown', ev=>{
      ev.preventDefault(); const id=+el.dataset.id; if(S.des.sel!==id){ S.des.sel=id; cv.querySelectorAll('.el').forEach(x=>x.classList.toggle('sel', +x.dataset.id===id)); }
      const r = cv.getBoundingClientRect(), zr = pz.getBoundingClientRect(); const e = selEl();
      const move = m=>{
        let x=(m.clientX-r.left)/r.width*100, y=(m.clientY-r.top)/r.height*100;
        const minx=(zr.left-r.left)/r.width*100, maxx=(zr.right-r.left)/r.width*100, miny=(zr.top-r.top)/r.height*100, maxy=(zr.bottom-r.top)/r.height*100;
        e.x=Math.max(minx,Math.min(maxx,x)); e.y=Math.max(miny,Math.min(maxy,y)); el.style.left=e.x+'%'; el.style.top=e.y+'%';
      };
      const up = ()=>{ window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); render(); };
      window.addEventListener('pointermove',move); window.addEventListener('pointerup',up);
    });
  });
}
