// -- State --
const S={googleUser:null,username:'',best:0,leaderboard:[]};
function loadLS(){
  try{
    const lb=localStorage.getItem('rocky_lb');if(lb)S.leaderboard=JSON.parse(lb);
    const b=localStorage.getItem('rocky_best_'+(S.googleUser?.sub||'g'));if(b)S.best=parseInt(b)||0;
  }catch(e){}
}
function saveLS(){
  try{
    localStorage.setItem('rocky_lb',JSON.stringify(S.leaderboard));
    localStorage.setItem('rocky_best_'+(S.googleUser?.sub||'g'),S.best);
  }catch(e){}
}
function recordScore(u,sc,gid){
  const i=S.leaderboard.findIndex(e=>e.gid===gid);
  if(i>=0){if(sc>S.leaderboard[i].sc){S.leaderboard[i].sc=sc;S.leaderboard[i].u=u;}}
  else S.leaderboard.push({u,sc,gid});
  S.leaderboard.sort((a,b)=>b.sc-a.sc);
  S.leaderboard=S.leaderboard.slice(0,100);
  saveLS();
}
function renderLB(){
  const el=document.getElementById('lbContent');
  if(!S.leaderboard.length){el.innerHTML='<p class="lb-empty">No scores yet. Be the first!</p>';return;}
  const rk=['#1','#2','#3'];
  const rows=S.leaderboard.slice(0,50).map((e,i)=>{
    const me=e.gid===(S.googleUser?.sub||'guest');
    const rc=i<3?`rank-${i+1}`:'';
    const med=i<3?`<span>${rk[i]}</span>`:`<span style="color:var(--muted)">#${i+1}</span>`;
    const you=me?'<span class="you-tag">YOU</span>':'';
    return`<tr class="${rc}"><td>${med}</td><td>${esc(e.u)}${you}</td><td class="score-td">${e.sc.toLocaleString()}</td></tr>`;
  }).join('');
  el.innerHTML=`<table class="lb-table"><thead><tr><th>#</th><th>Player</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function esc(s){return String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));}
function showToast(msg,ms=2500){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),ms);}

// -- Stars --
(function(){
  const c=document.getElementById('stars');
  for(let i=0;i<80;i++){
    const s=document.createElement('div');s.className='star';
    const sz=Math.random()*2+.5;
    s.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;animation-delay:${Math.random()*5}s`;
    c.appendChild(s);
  }
})();

// -- Login --
let gLoggedIn=false;
document.getElementById('btnGoogle').addEventListener('click',()=>{
  const popup=window.open('','Google Sign-In','width=460,height=540,top=120,left=200');
  if(!popup){simLogin();return;}
  popup.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Google Sign-In</title><style>body{margin:0;font-family:Roboto,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:1.2rem;background:#f8fafc;}.logo{font-size:1.5rem;}.g1{color:#4285F4}.g2{color:#EA4335}.g3{color:#FBBC05}.g4{color:#34A853}h2{color:#202124;font-size:1.2rem;margin:0;}p{color:#5f6368;font-size:.85rem;}input{border:1.5px solid #dadce0;border-radius:8px;padding:.75rem 1rem;font-size:.95rem;width:240px;outline:none;}input:focus{border-color:#1a73e8;}button{background:#1a73e8;color:#fff;border:none;border-radius:6px;padding:.7rem 2rem;font-size:.95rem;cursor:pointer;width:240px;}button:hover{background:#1558b0;}</style></head><body><div class="logo"><span class="g1">G</span><span class="g2">o</span><span class="g3">o</span><span class="g1">g</span><span class="g4">l</span><span class="g2">e</span></div><h2>Sign in to Rocky In The City</h2><p>Use your Google account</p><input id="em" placeholder="Email" value="player@gmail.com"><button onclick="go()">Continue</button><script>function go(){const em=document.getElementById('em').value||'player@gmail.com';window.opener.postMessage({type:'glogin',email:em,sub:'u'+Math.random().toString(36).slice(2)},'*');window.close();}<\/script></body></html>`);
});
window.addEventListener('message',e=>{if(e.data?.type==='glogin')handleG(e.data);});
function simLogin(){handleG({email:'player@gmail.com',sub:'u'+Date.now()});}
function handleG(u){
  gLoggedIn=true;S.googleUser=u;
  document.getElementById('gBadge').style.display='flex';
  document.getElementById('gEmail').textContent=u.email;
  const btn=document.getElementById('btnGoogle');
  btn.classList.add('done');
  btn.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Signed in as ${u.email}`;
  loadLS();checkReady();showToast('Signed in successfully!');
}
const uInput=document.getElementById('usernameInput');
uInput.addEventListener('input',()=>{document.getElementById('charCount').textContent=uInput.value.length;checkReady();});
function checkReady(){const ok=gLoggedIn&&uInput.value.trim().length>=2;document.getElementById('btnStart').classList.toggle('ready',ok);}
document.getElementById('btnStart').addEventListener('click',()=>{
  if(!gLoggedIn){showToast('Please sign in with Google first');return;}
  const u=uInput.value.trim();if(u.length<2){showToast('Username must be at least 2 characters');return;}
  S.username=u;
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  document.getElementById('hudName').textContent=u;
  document.getElementById('avatarCircle').textContent=u[0].toUpperCase();
  document.getElementById('bestDisplay').textContent=String(S.best).padStart(5,'0');
  loadLS();
});

// -- Leaderboard modal --
document.getElementById('btnLB').addEventListener('click',()=>{renderLB();document.getElementById('lbModal').classList.add('open');});
document.getElementById('btnCloseLB').addEventListener('click',()=>document.getElementById('lbModal').classList.remove('open'));
document.getElementById('lbModal').addEventListener('click',e=>{if(e.target===document.getElementById('lbModal'))document.getElementById('lbModal').classList.remove('open');});

loadLS();
