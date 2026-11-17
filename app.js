/* ---------- SALES REP PORTAL ---------- */
function repSide(on){
  return `<aside class="side">${LOGO}
    <div class="lbl">Sales rep</div>
    <a href="#/rep" class="${on==='quote'?'on':''}">⚡ Quick quote</a>
    <a href="#/rep/quotes" class="${on==='quotes'?'on':''}">📄 My quotes</a>
    <a href="#/rep/customers" class="${on==='cust'?'on':''}">🏫 My customers</a>
    <a href="#/catalog">🛍 Full catalog</a>
    <div class="who"><div class="av">KM</div><div><b>Kayla M.</b><div class="tiny muted">Sales rep</div></div></div></aside>`;
}
function repLineCalc(l){ const p=P(l.pid); return { p, q:quoteLine(p,l.qty,l.locs,S.rep.markup) }; }
function rep(){
  const cust = CUSTOMERS.find(c=>c.id===S.rep.cust);
  const lines = S.rep.lines.map(repLineCalc);
  const sub = lines.reduce((s,x)=>s+x.q.total,0);
  const cost = lines.reduce((s,x,i)=>s+x.q.cost*S.rep.lines[i].qty,0);
  const margin = sub ? (sub-cost)/sub : 0;
  const starters = PRODUCTS.filter(p=>p.popular).sort((a,b)=>b.sold-a.sold).slice(0,6);
  return `<div class="app">${repSide('quote')}<main class="main">
    <div class="top"><div><h2 style="margin:0">Quick quote</h2><div class="muted small">Prices use live vendor cost + Bell's markup rules. Updated today at 10:42 AM.</div></div>
      <div class="flex"><span class="small muted">Show my cost and margin</span><span class="toggle ${S.rep.showCost?'on':''}" onclick="S.rep.showCost=!S.rep.showCost;render()"></span></div></div>
    <div class="split">
      <div class="col">
        <div class="card"><h3>1. Customer</h3>
          <select style="width:100%" onchange="S.rep.cust=this.value;render()">${CUSTOMERS.map(c=>`<option value="${c.id}" ${c.id===S.rep.cust?'selected':''}>${c.name} — ${c.sub}</option>`).join('')}<option>+ New customer…</option></select>
          <div class="flex small muted" style="margin-top:10px;flex-wrap:wrap"><span class="tag blue">${cust.tier==='school'?'School pricing':'Standard pricing'}</span><span>Colors: ${cust.colors}</span><span>· ${cust.logos} logo(s) on file</span><span>· Last order ${cust.lastOrder}</span></div>
        </div>
        <div class="card"><h3>2. Add a product</h3><div class="small muted" style="margin-bottom:10px">Our 6 best sellers. Most quotes only need these.</div>
          <div class="picklist">${starters.map(p=>`<div class="pick" onclick="addRepLine('${p.id}')"><div class="mini">${garment(p.type,p.colors[1]?p.colors[1].hex:p.colors[0].hex,'front',48)}</div><div><div style="font-weight:600;font-size:.9rem">${p.brand} ${p.style}</div><div class="tiny muted">${p.name}</div></div></div>`).join('')}</div>
          <div class="flex" style="margin-top:12px"><input type="search" placeholder="Need something else? Search all SanMar + S&S styles…" style="flex:1" oninput="toast('Searches the full vendor catalog in the real build')"></div>
        </div>
        <div class="card"><h3>3. Quote lines</h3>
          ${S.rep.lines.map((l,i)=>{ const {p,q}=lines[i]; const zs=[...zonesFor(p).front,...zonesFor(p).back]; return `
          <div style="border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:10px">
            <div class="flex between"><div class="flex"><div class="mini">${garment(p.type,(p.colors.find(c=>c.key===l.color)||p.colors[0]).hex,'front',40)}</div><div><b>${p.brand} ${p.style}</b> <span class="muted small">${p.name}</span></div></div><button class="btn sm ghost" onclick="S.rep.lines.splice(${i},1);render()">✕</button></div>
            <div class="flex" style="margin-top:10px;flex-wrap:wrap">
              <div class="field">Color<select onchange="S.rep.lines[${i}].color=this.value;render()">${p.colors.map(c=>`<option value="${c.key}" ${c.key===l.color?'selected':''}>${c.name}</option>`).join('')}</select></div>
              <div class="field">Quantity<input type="number" min="1" value="${l.qty}" style="width:90px" onchange="S.rep.lines[${i}].qty=+this.value;render()"></div>
              ${l.locs.map((loc,j)=>{ const z=zs.find(a=>a.id===loc.zone); return `<div class="field">${z.name}<div class="flex" style="gap:4px"><select onchange="S.rep.lines[${i}].locs[${j}].method=this.value;render()">${z.methods.map(m=>`<option value="${m}" ${m===loc.method?'selected':''}>${METHODS[m].split(' (')[0]}</option>`).join('')}</select>${loc.method==='sp'?`<select onchange="S.rep.lines[${i}].locs[${j}].colors=+this.value;render()">${[1,2,3,4,5,6].map(n=>`<option ${n===loc.colors?'selected':''}>${n}</option>`).join('')}</select>`:''}</div></div>`;}).join('')}
              <div class="field">&nbsp;<select onchange="if(this.value){S.rep.lines[${i}].locs.push({zone:this.value,method:allZ('${l.pid}').find(a=>a.id===this.value).methods[0],colors:1});render()}"><option value="">+ Location</option>${zs.filter(z=>!l.locs.find(x=>x.zone===z.id)).map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            </div>
            <div class="flex between small" style="margin-top:8px"><span class="muted">${money(q.unit)} each${q.setup?` + ${money(q.setup)} setup`:''}${S.rep.showCost?` · cost ≈ ${money(q.cost)}/ea`:''}</span><b>${money(q.total)}</b></div>
          </div>`;}).join('') || '<div class="muted small">Add a product above.</div>'}
        </div>
      </div>
      <div class="col" style="position:sticky;top:56px">
        <div class="card"><h3>Quote summary</h3>
          <div class="muted small">${cust.name} · Q-2026-0418</div>
          <table class="t" style="margin:10px 0">${lines.map((x,i)=>`<tr><td>${x.p.brand} ${x.p.style} × ${S.rep.lines[i].qty}</td><td class="num">${money(x.q.total)}</td></tr>`).join('')}
          <tr><td><b>Total</b></td><td class="num"><b style="font-size:1.2rem">${money(sub)}</b></td></tr></table>
          ${S.rep.showCost?`<div class="small flex between"><span>Gross margin</span><b style="color:${margin<.3?'var(--bad)':margin<.4?'var(--warn)':'var(--ok)'}">${Math.round(margin*100)}%</b></div>
            <div class="marginbar" style="margin:6px 0 12px"><i style="width:${Math.max(0,Math.min(100,margin*100))}%;background:${margin<.3?'var(--bad)':margin<.4?'var(--warn)':'var(--ok)'}"></i></div>
            <div class="field">Markup on blanks: ${Math.round(S.rep.markup*100)}% <input type="range" min="${MARKUP.floor*100}" max="120" value="${S.rep.markup*100}" onchange="S.rep.markup=this.value/100;render()"></div>
            <div class="tiny muted">The floor (${Math.round(MARKUP.floor*100)}%) is set by the back office. Reps can't quote below it.</div>`:''}
        </div>
        <div class="card col">
          <button class="btn pri block" onclick="toast('Quote emailed to customer with an Approve + Pay link')">📧 Send to customer</button>
          <button class="btn block" onclick="toast('PDF quote downloaded (demo)')">⬇ Download PDF</button>
          <button class="btn block" onclick="toast('Converted to order. Art team notified.')">✔ Convert to order</button>
          <div class="tiny muted">Customer gets a link to approve the quote, upload art, and pay online.</div>
        </div>
      </div>
    </div></main></div>`;
}
function addRepLine(id){ const p=P(id); S.rep.lines.push({pid:id,color:(p.colors[1]||p.colors[0]).key,qty:24,locs:[p.type==='hat'?{zone:'hf',method:'emb'}:{zone:'ff',method:'sp',colors:1}]}); render(); toast(p.brand+' '+p.style+' added'); }
function repQuotes(){
  const rows=[['Q-2026-0418','Timpview High School','Draft','$1,742.40','Today'],['Q-2026-0411','Lone Peak High School','Sent','$2,310.00','2026-11-14'],['Q-2026-0402','Utah Valley Youth Soccer','Approved','$968.50','2026-11-09'],['Q-2026-0397','Mountain Credit Union','Viewed','$1,120.80','2026-11-06'],['Q-2026-0380','American Fork Elementary','Expired','$412.00','2026-10-12']];
  const tg={Draft:'gray',Sent:'blue',Approved:'ok',Viewed:'warn',Expired:'bad'};
  return `<div class="app">${repSide('quotes')}<main class="main"><div class="top"><h2 style="margin:0">My quotes</h2><a class="btn pri" href="#/rep">+ New quote</a></div>
  <div class="card"><table class="t"><tr><th>Quote</th><th>Customer</th><th>Status</th><th class="num">Total</th><th>Updated</th><th></th></tr>
  ${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="tag ${tg[r[2]]}">${r[2]}</span></td><td class="num">${r[3]}</td><td>${r[4]}</td><td class="num"><a href="#/rep">Open</a></td></tr>`).join('')}</table></div></main></div>`;
}
function repCustomers(){
  return `<div class="app">${repSide('cust')}<main class="main"><div class="top"><h2 style="margin:0">My customers</h2><button class="btn pri" onclick="toast('Invite sent: customer can sign in and see their pricing')">+ Invite customer</button></div>
  <div class="card"><table class="t"><tr><th>Customer</th><th>Pricing</th><th>Logos on file</th><th>Last order</th><th></th></tr>
  ${CUSTOMERS.map(c=>`<tr><td><b>${c.name}</b><div class="tiny muted">${c.sub}</div></td><td><span class="tag ${c.tier==='school'?'blue':'gray'}">${c.tier==='school'?'School':'Standard'}</span></td><td>${c.logos}</td><td>${c.lastOrder}</td><td class="num"><a href="#/rep" onclick="S.rep.cust='${c.id}'">Quote</a></td></tr>`).join('')}</table></div>
  <div class="info" style="margin-top:14px">Invited customers sign in on the public site and see their school pricing, approved logos, and past orders — without calling the rep.</div></main></div>`;
}

/* ---------- EMPLOYEE BACK OFFICE ---------- */
function adminSide(on){
  const L=(h,k,t)=>`<a href="${h}" class="${on===k?'on':''}">${t}</a>`;
  return `<aside class="side">${LOGO}
    <div class="lbl">Back office</div>
    ${L('#/admin','dash','📊 Dashboard')}${L('#/admin/orders','orders','📦 Orders')}${L('#/admin/art','art','🎨 Art approvals')}
    <div class="lbl">Catalog</div>
    ${L('#/admin/products','prod','👕 Products')}${L('#/admin/product/g5000','zones','📐 Print areas')}${L('#/admin/pricing','price','💲 Pricing rules')}
    <div class="lbl">Setup</div>
    ${L('#/admin/customers','cust','🏫 Customers')}${L('#/admin/vendors','vend','🔌 Vendors')}
    <div class="who"><div class="av">JS</div><div><b>Josh S.</b><div class="tiny muted">Admin</div></div></div></aside>`;
}
function admin(){
  const orders=[['#10482','Timpview High School','G5000 × 96, G18500 × 36','In production','Rep'],['#10481','Sarah P. (retail)','BC3001 × 3','Awaiting art','Web'],['#10480','Lone Peak PTSA','ST350 × 140','Proof sent','Rep'],['#10479','Jason K. (retail)','G18500 × 1','Shipped','Web'],['#10478','Utah Valley Youth Soccer','PC54 × 220','Printing','Rep']];
  const tg={'In production':'blue','Awaiting art':'warn','Proof sent':'gray',Shipped:'ok',Printing:'blue'};
  return `<div class="app">${adminSide('dash')}<main class="main">
    <div class="top"><div><h2 style="margin:0">Dashboard</h2><div class="muted small">Tuesday, November 17, 2026</div></div><a class="btn pri" href="#/admin/products">+ Add product</a></div>
    <div class="kpis">
      <div class="card kpi"><div class="l">Open quotes</div><div class="v">23</div><div class="tiny muted">$31,420 potential</div></div>
      <div class="card kpi"><div class="l">In production</div><div class="v">14</div><div class="tiny muted">3 due this week</div></div>
      <div class="card kpi"><div class="l">Art waiting on us</div><div class="v" style="color:var(--warn)">6</div><div class="tiny muted">2 design requests</div></div>
      <div class="card kpi"><div class="l">Web sales, November</div><div class="v">$8,420</div><div class="tiny muted">41 retail orders</div></div>
    </div>
    <div class="split">
      <div class="card"><div class="flex between"><h3>Recent orders</h3><a class="small" href="#/admin/orders">View all</a></div>
        <table class="t"><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Source</th></tr>
        ${orders.map(o=>`<tr><td><b>${o[0]}</b></td><td>${o[1]}</td><td class="small">${o[2]}</td><td><span class="tag ${tg[o[3]]}">${o[3]}</span></td><td class="small muted">${o[4]}</td></tr>`).join('')}</table></div>
      <div class="col">
        <div class="card"><h3>Vendor sync</h3>
          <div class="flex between small" style="padding:6px 0"><span>🟢 S&S Activewear</span><span class="muted">Prices + stock synced 10:42 AM</span></div>
          <div class="flex between small" style="padding:6px 0"><span>🟢 SanMar</span><span class="muted">Prices + stock synced 10:40 AM</span></div>
          <div class="hint" style="margin-top:8px">⚠ 2 price changes since yesterday: Gildan 18500 +$0.36, PC54 −$0.08. Customer prices updated automatically.</div></div>
        <div class="card"><h3>Blank orders to place</h3><div class="small muted">Ready to send to vendors from approved orders.</div>
          <div class="flex between small" style="padding:8px 0;border-bottom:1px solid var(--line)"><span>S&S · 132 pcs · 2 orders</span><button class="btn sm" onclick="toast('PO sent to S&S via API (demo)')">Send PO</button></div>
          <div class="flex between small" style="padding:8px 0"><span>SanMar · 360 pcs · 2 orders</span><button class="btn sm" onclick="toast('PO sent to SanMar via API (demo)')">Send PO</button></div></div>
      </div>
    </div></main></div>`;
}
function adminOrders(){ return admin().replace('<h2 style="margin:0">Dashboard</h2>','<h2 style="margin:0">Orders</h2>').replace(`class="on">📊`,`>📊`).replace(`href="#/admin/orders" class=""`,`href="#/admin/orders" class="on"`); }
function adminProducts(){
  return `<div class="app">${adminSide('prod')}<main class="main">
  <div class="top"><div><h2 style="margin:0">Products</h2><div class="muted small">Products customers and reps can see. Costs update from vendors daily.</div></div><button class="btn pri" onclick="document.getElementById('imp').style.display='block'">+ Import from vendor</button></div>
  <div class="card" id="imp" style="display:none;margin-bottom:16px;border-color:var(--blue)"><h3>Import a product</h3>
    <div class="flex"><select><option>S&S Activewear</option><option>SanMar</option></select><input type="search" value="Gildan 64000" style="flex:1"><button class="btn pri" onclick="toast('Imported Gildan 64000 Softstyle Tee with 62 colors, sizes, images, and live cost')">Search</button></div>
    <table class="t" style="margin-top:10px"><tr><td><b>Gildan 64000</b> Softstyle T-Shirt</td><td>62 colors</td><td>S–5XL</td><td>Cost $2.71–$4.18</td><td class="num"><button class="btn sm pri" onclick="toast('Imported. Now set its print areas.');go('#/admin/product/g5000')">Import</button></td></tr>
    <tr><td><b>Gildan 64400</b> Softstyle Long Sleeve</td><td>24 colors</td><td>S–3XL</td><td>Cost $5.02–$6.88</td><td class="num"><button class="btn sm" onclick="toast('Imported')">Import</button></td></tr></table></div>
  <div class="card"><table class="t"><tr><th></th><th>Product</th><th>Vendor</th><th class="num">Cost (live)</th><th class="num">Retail from</th><th>Popular</th><th>Shown to</th><th>Print areas</th><th></th></tr>
  ${PRODUCTS.map(p=>`<tr><td><div class="mini">${garment(p.type,p.colors[1]?p.colors[1].hex:p.colors[0].hex,'front',40)}</div></td><td><b>${p.brand} ${p.style}</b><div class="tiny muted">${p.name}</div></td><td>${p.vendor}</td><td class="num">${money(p.cost)}</td>
    <td class="num">${money(quoteLine(p,24,[{zone:'ff',method:'sp',colors:1}],MARKUP.retail).unit)}</td>
    <td><span class="toggle ${p.popular?'on':''}" onclick="P('${p.id}').popular=!P('${p.id}').popular;render()"></span></td>
    <td class="small">${p.popular?'Retail · Schools · Reps':'Reps only'}</td><td>${[...zonesFor(p).front,...zonesFor(p).back].length}</td><td class="num"><a href="#/admin/product/${p.id}">Edit</a></td></tr>`).join('')}</table></div></main></div>`;
}
function adminProduct(id){
  const p = P(id)||P('g5000'); S.zed.pid=p.id;
  const zones = zonesFor(p)[S.zed.view];
  const sel = zones.find(z=>z.id===S.zed.sel) || zones[0]; S.zed.sel = sel.id;
  const col = p.colors[Math.min(2,p.colors.length-1)];
  return `<div class="app">${adminSide('zones')}<main class="main">
  <div class="top"><div><div class="small muted"><a href="#/admin/products">Products</a> / ${p.brand} ${p.style}</div><h2 style="margin:0">${p.name}</h2></div><div class="flex"><a class="btn" href="#/product/${p.id}">View on site</a><button class="btn pri" onclick="toast('Saved. Changes are live on the site.')">Save</button></div></div>
  <div class="tabs"><a>Details</a><a class="on">Print areas</a><a>Pricing</a><a>Visibility</a></div>
  <div class="split3">
    <div class="card zonelist"><h3>Print areas</h3>
      <div class="flex" style="margin-bottom:10px"><button class="btn sm ${S.zed.view==='front'?'pri':''}" onclick="S.zed.view='front';S.zed.sel=null;render()">Front</button><button class="btn sm ${S.zed.view==='back'?'pri':''}" onclick="S.zed.view='back';S.zed.sel=null;render()">Back</button></div>
      ${zones.map(z=>`<div class="zrow ${z.id===sel.id?'sel':''}" onclick="S.zed.sel='${z.id}';render()"><span style="width:10px;height:10px;border:2px dashed var(--blue);border-radius:2px"></span><div style="flex:1"><b class="small">${z.name}</b><div class="tiny muted">${z.maxIn} · ${z.methods.map(m=>METHODS[m].split(' ')[0]).join(', ')}</div></div></div>`).join('')}
      <button class="btn sm block" style="margin-top:10px" onclick="addZone()">+ Add print area</button>
      <div class="tiny muted" style="margin-top:10px">Set it up once per product. Customers only see these areas in the shop and design studio.</div>
    </div>
    <div class="card"><div class="zed" id="zed">${garment(p.type,col.hex,S.zed.view,600).replace('width="600" height="600"','')}
      ${zones.map(z=>`<div class="zone ${z.id===sel.id?'sel':''}" data-id="${z.id}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%"><span>${z.name}</span><div class="h"></div></div>`).join('')}</div>
      <div class="small muted" style="margin-top:8px;text-align:center">Drag a box to move it. Drag the corner to resize it.</div></div>
    <div class="card col"><h3>${sel.name}</h3>
      <div class="field">Name<input type="text" value="${sel.name}" onchange="curZone().name=this.value;render()"></div>
      <div class="field">Max print size<input type="text" value="${sel.maxIn}" onchange="curZone().maxIn=this.value;render()"></div>
      <div class="field">Allowed methods${Object.entries(METHODS).map(([k,v])=>`<label class="flex small" style="font-weight:400;gap:8px"><input type="checkbox" ${sel.methods.includes(k)?'checked':''} onchange="toggleMethod('${k}')"> ${v}</label>`).join('')}</div>
      <div class="field">Extra charge for this area<input type="text" value="$0.00"></div>
      <div class="field">Position (auto)<div class="tiny muted" style="font-weight:400">x ${Math.round(sel.x)}% · y ${Math.round(sel.y)}% · ${Math.round(sel.w)}% × ${Math.round(sel.h)}%</div></div>
      <button class="btn sm" style="color:var(--bad)" onclick="delZone()">Delete area</button>
      <div class="info tiny">Tip: Save these as a template ("Standard tee") and apply it to every similar shirt in one click.</div>
    </div>
  </div></main></div>`;
}
const curZone = () => zonesFor(P(S.zed.pid))[S.zed.view].find(z=>z.id===S.zed.sel);
function toggleMethod(k){ const z=curZone(); z.methods = z.methods.includes(k)? z.methods.filter(m=>m!==k) : [...z.methods,k]; if(!z.methods.length) z.methods=[k]; render(); }
function addZone(){ const arr=zonesFor(P(S.zed.pid))[S.zed.view]; const id='z'+Date.now(); arr.push({id,name:'New area',x:40,y:40,w:20,h:12,maxIn:'4" × 3"',methods:['sp']}); S.zed.sel=id; render(); }
function delZone(){ const arr=zonesFor(P(S.zed.pid))[S.zed.view]; if(arr.length<2) return toast('Keep at least one area'); arr.splice(arr.findIndex(z=>z.id===S.zed.sel),1); S.zed.sel=null; render(); }
function bindZed(){
  const box=$('#zed'); if(!box) return;
  box.querySelectorAll('.zone').forEach(el=>{
    el.addEventListener('pointerdown', ev=>{
      ev.preventDefault(); const id=el.dataset.id; S.zed.sel=id; const z=curZone();
      box.querySelectorAll('.zone').forEach(x=>x.classList.toggle('sel',x.dataset.id===id));
      const r=box.getBoundingClientRect(), sx=ev.clientX, sy=ev.clientY, o={...z}, resize=ev.target.classList.contains('h');
      const move=m=>{ const dx=(m.clientX-sx)/r.width*100, dy=(m.clientY-sy)/r.height*100;
        if(resize){ z.w=Math.max(4,Math.min(100-o.x,o.w+dx)); z.h=Math.max(3,Math.min(100-o.y,o.h+dy)); }
        else { z.x=Math.max(0,Math.min(100-o.w,o.x+dx)); z.y=Math.max(0,Math.min(100-o.h,o.y+dy)); }
        el.style.left=z.x+'%'; el.style.top=z.y+'%'; el.style.width=z.w+'%'; el.style.height=z.h+'%'; };
      const up=()=>{ window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); render(); };
      window.addEventListener('pointermove',move); window.addEventListener('pointerup',up);
    });
  });
}
function adminPricing(){
  return `<div class="app">${adminSide('price')}<main class="main">
  <div class="top"><div><h2 style="margin:0">Pricing rules</h2><div class="muted small">Vendor cost + your markup + decoration price = customer price. Change a number and every product updates.</div></div><button class="btn pri" onclick="toast('Pricing saved')">Save</button></div>
  <div class="grid g3" style="margin-bottom:18px">
    <div class="card"><h3>Markup on blank garments</h3>
      <div class="field">Retail (public website)<input type="number" value="${MARKUP.retail*100}" onchange="MARKUP.retail=this.value/100"></div>
      <div class="field" style="margin-top:8px">School / contract customers<input type="number" value="${MARKUP.school*100}" onchange="MARKUP.school=this.value/100"></div>
      <div class="field" style="margin-top:8px">Sales rep default<input type="number" value="${MARKUP.rep*100}" onchange="MARKUP.rep=this.value/100"></div>
      <div class="field" style="margin-top:8px">Rep minimum (floor)<input type="number" value="${MARKUP.floor*100}" onchange="MARKUP.floor=this.value/100"></div><div class="tiny muted">Percent over vendor cost.</div></div>
    <div class="card"><h3>Setup fees</h3>
      <div class="field">Screen setup (per color, per location)<input type="number" value="${SETUP.screen}"></div>
      <div class="field" style="margin-top:8px">Embroidery digitizing (one time per logo)<input type="number" value="${SETUP.digitize}"></div>
      <div class="field" style="margin-top:8px">"Bell designs it" fee<input type="number" value="${SETUP.design}"></div></div>
    <div class="card"><h3>Other rules</h3>
      <div class="field">Screen print minimum<input type="number" value="12"></div>
      <div class="field" style="margin-top:8px">2XL upcharge<input type="number" value="2.00"></div>
      <div class="field" style="margin-top:8px">3XL+ upcharge<input type="number" value="3.00"></div>
      <div class="field" style="margin-top:8px">Standard turnaround (business days)<input type="number" value="10"></div></div>
  </div>
  <div class="card"><h3>Screen print price per piece, per location</h3>
    <table class="t matrix"><tr><th>Quantity</th>${[1,2,3,4,5,6].map(n=>`<th class="num">${n} color${n>1?'s':''}</th>`).join('')}</tr>
    ${SP.map((row,i)=>row?`<tr><td><b>${TIER_LBL[i]}</b></td>${row.map(v=>`<td class="num"><input type="number" step=".05" value="${v.toFixed(2)}"></td>`).join('')}</tr>`:'').join('')}</table></div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h3>Embroidery (up to 8,000 stitches)</h3><table class="t matrix">${EMB.map((v,i)=>`<tr><td>${TIER_LBL[i]}</td><td class="num"><input type="number" value="${v.toFixed(2)}"></td></tr>`).join('')}</table></div>
    <div class="card"><h3>Full-color transfer (DTF)</h3><table class="t matrix"><tr><th>Qty</th><th class="num">Small (chest)</th><th class="num">Large (full)</th></tr>${DTF_S.map((v,i)=>`<tr><td>${TIER_LBL[i]}</td><td class="num"><input type="number" value="${v.toFixed(2)}"></td><td class="num"><input type="number" value="${DTF_L[i].toFixed(2)}"></td></tr>`).join('')}</table></div>
  </div></main></div>`;
}
function adminArt(){
  const rows=[['#10481','Sarah P. (retail)','Uploaded logo.png','Low resolution — needs vector','warn'],['#10483','Lone Peak PTSA','Design request: "Spirit Week 2026"','Assigned to Maria','blue'],['#10480','Lone Peak PTSA','Proof v2 sent','Waiting on customer','gray'],['#10485','Mike R. (retail)','Designed in studio','Ready to approve','ok']];
  return `<div class="app">${adminSide('art')}<main class="main"><div class="top"><h2 style="margin:0">Art approvals</h2></div>
  <div class="grid g2">${rows.map(r=>`<div class="card flex" style="align-items:flex-start"><div class="mini" style="width:84px;height:84px">${garment('tee','#1f2a52','front',80)}</div><div style="flex:1"><div class="flex between"><b>${r[0]} · ${r[1]}</b><span class="tag ${r[4]}">${r[3]}</span></div><div class="small muted" style="margin:4px 0 10px">${r[2]}</div><div class="flex"><button class="btn sm pri" onclick="toast('Proof emailed to customer')">Send proof</button><button class="btn sm" onclick="toast('Approved for production')">Approve</button><button class="btn sm ghost" onclick="toast('Customer asked for new file')">Request new file</button></div></div></div>`).join('')}</div></main></div>`;
}
function adminCustomers(){
  return `<div class="app">${adminSide('cust')}<main class="main"><div class="top"><h2 style="margin:0">Customers</h2><button class="btn pri" onclick="toast('Customer created')">+ Add customer</button></div>
  <div class="card"><table class="t"><tr><th>Customer</th><th>Pricing</th><th>Assigned rep</th><th>Logos</th><th>Can sign in</th><th></th></tr>
  ${CUSTOMERS.map(c=>`<tr><td><b>${c.name}</b><div class="tiny muted">${c.sub}</div></td><td><select><option ${c.tier==='school'?'selected':''}>School (60%)</option><option ${c.tier!=='school'?'selected':''}>Standard (100%)</option><option>Custom…</option></select></td><td>${c.rep}</td><td>${c.logos}</td><td><span class="toggle on"></span></td><td class="num"><a>Edit</a></td></tr>`).join('')}</table></div></main></div>`;
}
function adminVendors(){
  const V=(n,how,items,extra)=>`<div class="card"><div class="flex between"><h3 style="margin:0">${n}</h3><span class="tag ok">Connected (demo)</span></div>
    <div class="small muted" style="margin:6px 0 12px">${how}</div>
    <table class="t small"><tr><td>Products synced</td><td class="num">${items}</td></tr><tr><td>Last price + stock sync</td><td class="num">Today 10:42 AM</td></tr><tr><td>Sync schedule</td><td class="num">Prices nightly · stock hourly</td></tr><tr><td>Send purchase orders</td><td class="num"><span class="toggle on"></span></td></tr></table>
    <div class="tiny muted" style="margin-top:10px">${extra}</div><button class="btn sm" style="margin-top:10px" onclick="toast('Sync started')">Sync now</button></div>`;
  return `<div class="app">${adminSide('vend')}<main class="main"><div class="top"><div><h2 style="margin:0">Vendors</h2><div class="muted small">Where product data, your cost, and stock come from.</div></div></div>
  <div class="grid g2">${V('S&S Activewear','REST API (api.ssactivewear.com/v2) · your account # + API key','48,210 SKUs','Returns your account price (CustomerPrice) and stock by warehouse. Limit: 60 requests per minute.')}
  ${V('SanMar','SOAP web services + PromoStandards · SanMar.com login + integration agreement','61,890 SKUs','Product, pricing, inventory, and purchase-order services. Requires a signed agreement and a static server IP. Bulk product files also come by FTP.')}</div></main></div>`;
}

/* ---------- PROJECT PLAN (for leadership) ---------- */
function plan(){
  return `<div class="wrap plan" style="max-width:900px;padding-top:30px;padding-bottom:60px">
  <span class="tag">Project plan · draft</span>
  <h1 style="margin-top:12px">Bell Custom Apparel website</h1>
  <p class="muted" style="font-size:1.1rem">An online store and quoting tool for custom shirts, hoodies, and hats. It serves walk-in retail customers, our school and team accounts, and our sales reps from one system.</p>
  <h2>What the mockup shows</h2>
  <ul>
    <li><a href="#/">Customer site</a>: popular products first, live per-piece pricing that drops as quantity goes up, and three art paths (upload, design it yourself, Bell designs it).</li>
    <li><a href="#/design">Design studio</a>: customers add text, clip art, or their logo. Designs stay inside the print areas our staff allows.</li>
    <li><a href="#/rep">Sales rep quick quote</a>: pick the customer, tap one of six best sellers, set quantity and print locations, and send a quote. Reps see cost and margin; customers don't.</li>
    <li><a href="#/admin">Back office</a>: import products from SanMar and S&S, <a href="#/admin/product/g5000">draw print areas on each product</a>, set <a href="#/admin/pricing">markup and decoration prices</a>, and work the art-approval queue.</li>
  </ul>
  <h2>How pricing works</h2>
  <ol>
    <li>Vendor cost comes from SanMar and S&S automatically (our account pricing, updated nightly).</li>
    <li>Bell's markup is added. Retail, school, and rep levels are separate, with a minimum reps can't go below.</li>
    <li>The decoration price comes from our price table (screen print by ink colors and quantity, embroidery, or full-color transfer).</li>
    <li>One-time setup fees are added (screens, embroidery digitizing, design service).</li>
  </ol>
  <h2>Vendor connections</h2>
  <ul>
    <li><b>S&S Activewear</b>: modern REST API. Product data, our account price, stock by warehouse, and order placement. Needs our account number and an API key.</li>
    <li><b>SanMar</b>: SOAP web services (an older style of API) plus the PromoStandards industry standard. Product, pricing, stock, and purchase orders. Needs a signed integration agreement and a fixed server IP address.</li>
  </ul>
  <h2>Why build instead of buy</h2>
  <ul>
    <li>Tools like DecoNetwork and InkSoft (which our two local competitors both use) charge monthly and look like every other shop's site.</li>
    <li>Building it lets it plug into our Umbrella and Tracker systems, use our existing school customer list, and fit how our reps already sell.</li>
  </ul>
  <h2>Suggested phases</h2>
  <ol>
    <li><b>Phase 1, rep quoting:</b> vendor sync, pricing rules, rep quick quote, and PDF quotes. Fastest payback.</li>
    <li><b>Phase 2, customer store:</b> public catalog, customer sign-in with school pricing, upload art, online checkout.</li>
    <li><b>Phase 3, design studio + automation:</b> online designer, art proofs, and sending blank orders straight to vendors.</li>
  </ol>
  <p class="muted small" style="margin-top:30px">All products, prices, and orders in this mockup are sample data.</p></div>`;
}

/* ---------- Router ---------- */
function render(){
  const h = location.hash.replace(/^#/,'') || '/';
  const parts = h.split('/').filter(Boolean);
  let mode='shop', html='';
  if(parts[0]==='rep'){ mode='rep'; html = parts[1]==='quotes'?repQuotes(): parts[1]==='customers'?repCustomers(): rep(); }
  else if(parts[0]==='admin'){ mode='admin';
    const k=parts[1]; html = !k?admin(): k==='orders'?adminOrders(): k==='products'?adminProducts(): k==='product'?adminProduct(parts[2]): k==='pricing'?adminPricing(): k==='art'?adminArt(): k==='customers'?adminCustomers(): k==='vendors'?adminVendors(): admin(); }
  else if(parts[0]==='plan'){ mode='plan'; html = plan(); }
  else { html = parts[0]==='catalog'?catalog(): parts[0]==='product'?product(parts[1]): parts[0]==='design'?designer(): parts[0]==='cart'?cart(): home(); }
  const sy = window.scrollY;
  $('#root').innerHTML = mockbar(mode) + html;
  window.scrollTo(0, render._last===h ? sy : 0); render._last = h;
  bindDesigner(); bindZed();
}
window.addEventListener('hashchange', ()=>{ if(location.hash==='#/how'){ render(); setTimeout(()=>{const e=document.getElementById('how'); e&&e.scrollIntoView({behavior:'smooth'})},30);} else render(); });
window.addEventListener('DOMContentLoaded', render);
