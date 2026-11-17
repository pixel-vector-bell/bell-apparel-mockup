/* ---------- Garment drawings (simple SVG silhouettes, tinted per color) ---------- */
function shade(hex, amt){
  let c = hex.replace('#',''); let n = parseInt(c,16);
  let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function garment(type, hex='#fafafa', view='front', size=180){
  const st = shade(hex, hex==='#fafafa'?-55:-35), hi = shade(hex, 18);
  const sw = 'stroke="'+st+'" stroke-width="1.6" stroke-linejoin="round"';
  let body = '';
  const shortTee = 'M70 22 Q100 '+(view==='front'?40:30)+' 130 22 L168 40 L190 78 L162 92 L154 82 L154 182 Q100 189 46 182 L46 82 L38 92 L10 78 L32 40 Z';
  const longTee  = 'M70 24 Q100 '+(view==='front'?42:32)+' 130 24 L166 38 L188 154 L167 158 L154 88 L154 184 Q100 191 46 184 L46 88 L33 158 L12 154 L34 38 Z';
  if(type==='tee' || type==='polo'){
    body = `<path d="${shortTee}" fill="${hex}" ${sw}/>`;
    body += view==='front' ? `<path d="M70 22 Q100 40 130 22" fill="none" ${sw}/><path d="M74 24 Q100 36 126 24" fill="none" stroke="${st}" stroke-width="1"/>`
                           : `<path d="M70 22 Q100 30 130 22" fill="none" ${sw}/>`;
    if(type==='polo' && view==='front'){
      body += `<path d="M78 21 L100 30 L122 21 L118 34 L100 30 L82 34 Z" fill="${hi}" ${sw}/><path d="M100 30 L100 62" ${sw}/><circle cx="100" cy="42" r="1.8" fill="${st}"/><circle cx="100" cy="53" r="1.8" fill="${st}"/>`;
    }
  } else if(type==='hoodie' || type==='crew' || type==='qzip'){
    if(type==='hoodie') body += `<path d="M66 30 Q62 2 100 2 Q138 2 134 30 Z" fill="${shade(hex,-12)}" ${sw}/>`;
    body += `<path d="${longTee}" fill="${hex}" ${sw}/>`;
    body += `<path d="M46 172 Q100 179 154 172" fill="none" stroke="${st}" stroke-width="1"/>`;
    if(view==='front'){
      if(type==='hoodie'){ body += `<path d="M70 26 Q100 50 130 26 Q118 46 100 48 Q82 46 70 26Z" fill="${shade(hex,-20)}" ${sw}/><path d="M92 46 L90 76 M108 46 L110 76" stroke="${st}" stroke-width="1.4"/><path d="M68 132 L132 132 L140 166 L60 166 Z" fill="none" ${sw}/>`; }
      if(type==='crew'){ body += `<path d="M70 24 Q100 46 130 24" fill="none" stroke="${st}" stroke-width="3"/>`; }
      if(type==='qzip'){ body += `<path d="M76 22 L100 34 L124 22 L122 32 L100 40 L78 32Z" fill="${hi}" ${sw}/><path d="M100 36 L100 86" stroke="#c9ccd6" stroke-width="2.2"/>`; }
    }
  } else if(type==='hat'){
    if(view==='front'){
      body = `<path d="M38 128 Q36 52 100 46 Q164 52 162 128 Z" fill="${hex}" ${sw}/>
              <path d="M100 46 L100 128 M70 52 Q60 90 64 128 M130 52 Q140 90 136 128" fill="none" stroke="${st}" stroke-width="1"/>
              <path d="M26 128 Q100 108 174 128 Q178 150 100 152 Q22 150 26 128Z" fill="${shade(hex,-14)}" ${sw}/>
              <circle cx="100" cy="47" r="4" fill="${st}"/>`;
    } else {
      body = `<path d="M38 128 Q36 52 100 46 Q164 52 162 128 Z" fill="${hex}" ${sw}/>
              <path d="M74 128 Q74 104 100 102 Q126 104 126 128" fill="#f1f2f7" ${sw}/>
              <path d="M40 128 L160 128" ${sw}/><circle cx="100" cy="47" r="4" fill="${st}"/>`;
    }
  }
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
function zonesFor(p){ return p.type==='hat' ? Z.hat : Z.tee; }

function allZ(pid){ const z=zonesFor(P(pid)); return [...z.front,...z.back]; }
