const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const W=920,H=290,GY=H-55;
const rock={x:85,y:GY-68,nw:52,nh:68,dw:72,dh:38,vy:0,jumps:0,ducking:false,landBounce:0};
let walkPhase=0;
function resetRock(){rock.y=GY-rock.nh;rock.vy=0;rock.ducking=false;rock.jumps=0;rock.landBounce=0;}
function doJump(){if(!running)return;if(rock.jumps<1){rock.vy=-15;rock.jumps++;}}
function doDuck(on){if(!running)return;rock.ducking=on;if(!rock.jumps){rock.y=GY-(on?rock.dh:rock.nh);}}

const OBS_TYPES=[
  {id:'bld_sm',w:26,h:55,cl:'#4a5568',ac:'#718096'},
  {id:'bld_md',w:34,h:78,cl:'#2d3748',ac:'#4a5568'},
  {id:'bld_lg',w:24,h:100,cl:'#1a202c',ac:'#2d3748'},
  {id:'bld_duo',w:58,h:62,cl:'#374151',ac:'#556070'},
  {id:'ufo',w:64,h:34,fly:true}
];
let obs=[],gems=[],parts=[];
let oTimer=0,gTimer=0,oInt=88;
let running=false,dead=false,score=0,sTimer=0,ufoT=0,speed=5;
let tileOff=0;
const TILE_W=44,TILE_N=Math.ceil(W/TILE_W)+2;

// Gem image
const batuImg=new Image();batuImg.src='assets/batu.png';let bLoaded=false;
batuImg.onload=()=>bLoaded=true;



// Background
const bgCity=[];
for(let i=0;i<22;i++)bgCity.push({x:Math.random()*W,w:18+Math.random()*70,h:28+Math.random()*100,op:.25+Math.random()*.2});
const bgClouds=[];
for(let i=0;i<8;i++)bgClouds.push({x:Math.random()*W,y:15+Math.random()*70,w:55+Math.random()*70,h:18+Math.random()*18,sp:0.25+Math.random()*0.4});

function spawnGem(){gems.push({x:W+10,y:GY-80-Math.random()*55,sz:22,bob:Math.random()*Math.PI*2});}
function spawnObs(){
  const t={...OBS_TYPES[Math.floor(Math.random()*OBS_TYPES.length)]};
  t.x=W+10;
  if(t.fly){t.baseY=GY-t.h-65-Math.random()*40;t.y=t.baseY;}
  obs.push(t);
}
function spawnPart(x,y,col){for(let i=0;i<8;i++)parts.push({x,y,col,vx:(Math.random()-.5)*6,vy:(Math.random()-1.8)*5,life:1,sz:3+Math.random()*4});}

// Sky
function drawSky(){
  const g=ctx.createLinearGradient(0,0,0,GY);
  g.addColorStop(0,'#2e86c1');g.addColorStop(0.45,'#87ceeb');g.addColorStop(0.7,'#d4902a');g.addColorStop(0.88,'#7a4010');g.addColorStop(1,'#3a1a05');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,GY);
  const sx=820,sy=48;
  const sg=ctx.createRadialGradient(sx,sy,6,sx,sy,55);
  sg.addColorStop(0,'rgba(255,230,60,.55)');sg.addColorStop(1,'rgba(255,180,0,0)');
  ctx.fillStyle=sg;ctx.fillRect(sx-55,sy-55,110,110);
  ctx.beginPath();ctx.arc(sx,sy,22,0,Math.PI*2);ctx.fillStyle='#FFE66D';ctx.fill();
  ctx.beginPath();ctx.arc(sx,sy,16,0,Math.PI*2);ctx.fillStyle='#FFC107';ctx.fill();
  bgClouds.forEach(c=>{
    ctx.save();ctx.globalAlpha=0.78;ctx.fillStyle='#fff';
    ctx.beginPath();ctx.ellipse(c.x,c.y,c.w/2,c.h/2,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(c.x-c.w*.25,c.y+c.h*.12,c.w*.32,c.h*.42,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(c.x+c.w*.25,c.y+c.h*.12,c.w*.32,c.h*.42,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
  bgCity.forEach(b=>{
    ctx.fillStyle=`rgba(45,62,80,${b.op})`;ctx.fillRect(b.x,GY-b.h,b.w,b.h);
    for(let r=4;r<b.h-8;r+=13)for(let c=3;c<b.w-3;c+=10){
      if(Math.random()>.8){ctx.fillStyle=`rgba(200,220,255,${b.op*.7})`;ctx.fillRect(b.x+c,GY-b.h+r,5,7);}
    }
  });
}
function drawGround(){
  const g=ctx.createLinearGradient(0,GY,0,H);
  g.addColorStop(0,'#8B7355');g.addColorStop(1,'#6B5740');
  ctx.fillStyle=g;ctx.fillRect(0,GY,W,H-GY);
  tileOff=(tileOff+speed)%TILE_W;
  for(let i=0;i<TILE_N;i++){
    const tx=i*TILE_W-tileOff;
    ctx.fillStyle=i%2===0?'#7a6348':'#6b5638';ctx.fillRect(tx,GY,TILE_W,H-GY);
    ctx.strokeStyle='rgba(120,90,50,.35)';ctx.lineWidth=1;ctx.strokeRect(tx,GY,TILE_W,H-GY);
    ctx.beginPath();ctx.ellipse(tx+12,GY+9,5,3,0,0,Math.PI*2);
    ctx.fillStyle='rgba(180,150,100,.22)';ctx.fill();
  }
  ctx.beginPath();ctx.moveTo(0,GY);ctx.lineTo(W,GY);
  ctx.strokeStyle='#f97316';ctx.lineWidth=2.5;
  ctx.shadowColor='#f97316';ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
}

// Rocky video sprite - uses mp_.mp4 for exact walking animation
const rockyVid=document.createElement('video');
rockyVid.src='assets/mp_.mp4';rockyVid.loop=true;rockyVid.muted=true;rockyVid.playsInline=true;
rockyVid.style.display='none';document.body.appendChild(rockyVid);
rockyVid.play().catch(()=>{});
function drawRocky(){
  const duck=rock.ducking&&!rock.jumps;
  const spd=Math.min((speed-5)/11,1);
  const cx=rock.x+(duck?rock.dw:rock.nw)/2;
  const feetY=rock.y+(duck?rock.dh:rock.nh);
  const bob=duck||rock.jumps>0?0:Math.abs(Math.sin(walkPhase))*(2+spd*4);
  const dw=duck?100:130,dh=duck?65:130;
  const feetFrac=0.87;
  const drawX=cx-dw/2,drawY=(feetY-bob)-dh*feetFrac;
  // Sync video playback speed to game speed
  rockyVid.playbackRate=Math.max(0.5,Math.min(2.5,0.6+spd*1.8));
  if(running&&rockyVid.paused)rockyVid.play().catch(()=>{});
  if(!running&&!rockyVid.paused)rockyVid.pause();
  if(duck){rockyVid.playbackRate=0.4;}
  ctx.save();
  // Draw Rocky video with screen blend - black bg disappears on dark ground sky
  if(rockyVid.readyState>=2){
    ctx.globalCompositeOperation='screen';
    ctx.drawImage(rockyVid,drawX,drawY,dw,dh);
    ctx.globalCompositeOperation='source-over';
  }else{
    drawRockyGolem(ctx,cx,feetY-bob-60,walkPhase,speed,duck,rock.jumps>0,rock.landBounce);
  }
  ctx.restore();
}

function drawObs(){
  obs.forEach(ob=>{
    const oy=ob.fly?ob.y:GY-ob.h;
    if(ob.id==='ufo'){
      const cx=ob.x+ob.w/2,cy=oy+ob.h/2;
      ctx.beginPath();ctx.ellipse(cx,cy+8,ob.w/2,11,0,0,Math.PI*2);
      const g1=ctx.createRadialGradient(cx,cy+8,1,cx,cy+8,ob.w/2);
      g1.addColorStop(0,'#6d28d9');g1.addColorStop(1,'#3b0764');
      ctx.fillStyle=g1;ctx.fill();
      ctx.beginPath();ctx.ellipse(cx,cy-4,ob.w/2-10,ob.h/2+2,0,0,Math.PI*2);
      ctx.fillStyle='#7c3aed';ctx.fill();
      ctx.beginPath();ctx.ellipse(cx,cy-8,13,9,0,0,Math.PI*2);
      ctx.fillStyle='rgba(186,230,253,.35)';ctx.fill();
      const lt=Date.now()/180;
      for(let i=0;i<6;i++){const lx=ob.x+7+i*9;const bl=Math.sin(lt+i)*.5+.5;ctx.beginPath();ctx.arc(lx,oy+ob.h-1,3,0,Math.PI*2);ctx.fillStyle=`rgba(${i%2?'249,115,22':'167,139,250'},${.5+bl*.5})`;ctx.fill();}
      ctx.beginPath();ctx.moveTo(cx-14,oy+ob.h);ctx.lineTo(cx+14,oy+ob.h);ctx.lineTo(cx+22,oy+ob.h+30);ctx.lineTo(cx-22,oy+ob.h+30);ctx.closePath();
      ctx.fillStyle='rgba(167,139,250,.07)';ctx.fill();
    }else{
      const bx=ob.x,bw=ob.w,bh=ob.h,by=GY-bh;
      ctx.fillStyle=ob.cl;ctx.fillRect(bx,by,bw,bh);
      ctx.fillStyle=ob.ac;ctx.fillRect(bx,by,bw,7);
      const wr=Math.floor((bh-12)/15),wc=Math.floor((bw-4)/11);
      for(let r=0;r<wr;r++)for(let c=0;c<wc;c++){
        ctx.fillStyle=Math.random()>.5?'rgba(251,191,36,.65)':'rgba(255,255,255,.07)';
        ctx.fillRect(bx+4+c*11,by+12+r*15,7,9);
      }
      if(bh>=70){ctx.strokeStyle='#6b7280';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+bw/2,by);ctx.lineTo(bx+bw/2,by-16);ctx.stroke();ctx.beginPath();ctx.arc(bx+bw/2,by-18,3,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.fill();}
    }
  });
}
function drawGems(){
  const t=Date.now()/550;
  gems.forEach(g=>{
    const bv=Math.sin(t+g.bob)*5,gy=g.y+bv;
    ctx.save();ctx.translate(g.x+g.sz/2,gy+g.sz/2);ctx.rotate(t*.8);
    if(bLoaded)ctx.drawImage(batuImg,-g.sz/2,-g.sz/2,g.sz,g.sz);
    else{ctx.beginPath();ctx.arc(0,0,g.sz/2,0,Math.PI*2);ctx.fillStyle='#f97316';ctx.fill();}
    ctx.restore();
    ctx.beginPath();ctx.arc(g.x+g.sz/2,gy+g.sz/2,g.sz*.9,0,Math.PI*2);
    ctx.fillStyle='rgba(249,115,22,.08)';ctx.fill();
  });
}
function drawParts(){
  parts.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2);
    ctx.fillStyle=p.col.replace(')',`,${p.life})`).replace('rgb','rgba');ctx.fill();
  });
}
function drawHUD(){
  ctx.font='bold 15px Orbitron,monospace';ctx.fillStyle='rgba(249,115,22,.85)';
  ctx.textAlign='right';ctx.fillText(String(score).padStart(5,'0'),W-14,26);ctx.textAlign='left';
  const sp=Math.min((speed-5)/11,1);
  ctx.fillStyle='rgba(249,115,22,.15)';ctx.fillRect(14,16,80,6);
  ctx.fillStyle=`rgba(249,${Math.floor(115-sp*90)},22,.85)`;ctx.fillRect(14,16,80*sp,6);
  if(sp>0.05){ctx.font='bold 9px Exo 2,sans-serif';ctx.fillStyle='rgba(249,115,22,.55)';ctx.fillText('SPEED',14,12);}
}
function getRR(){const duck=rock.ducking&&!rock.jumps;const rw=duck?rock.dw:rock.nw,rh=duck?rock.dh:rock.nh;return{x:rock.x+8,y:duck?GY-rh+4:rock.y+8,w:rw-16,h:rh-12};}
function col(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function update(){
  if(!running)return;
  ufoT+=.05;
  speed=Math.min(5+Math.floor(score/100)*.55,16);
  walkPhase+=0.14+(speed-5)*0.022;
  sTimer++;if(sTimer>=6){score++;sTimer=0;}
  document.getElementById('scoreDisplay').textContent=String(score).padStart(5,'0');
  oTimer++;oInt=Math.max(42,88-Math.floor(score/55)*2);
  if(oTimer>=oInt){spawnObs();oTimer=0;}
  gTimer++;if(gTimer>=55){if(Math.random()>.3)spawnGem();gTimer=0;}
  obs.forEach(o=>{o.x-=speed;if(o.fly)o.y=o.baseY+Math.sin(ufoT)*9;});
  obs=obs.filter(o=>o.x+o.w>-10);
  gems.forEach(g=>g.x-=speed);
  gems=gems.filter(g=>g.x+g.sz>-10);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.22;p.life-=.045;});
  parts=parts.filter(p=>p.life>0);
  bgCity.forEach(b=>{b.x-=speed*.13;if(b.x+b.w<0){b.x=W+20;b.h=28+Math.random()*100;}});
  bgClouds.forEach(c=>{c.x-=c.sp;if(c.x+c.w<0)c.x=W+c.w;});
  rock.vy+=.72;rock.y+=rock.vy;
  const fl=GY-(rock.ducking&&!rock.jumps?rock.dh:rock.nh);
  if(rock.y>=fl){if(rock.jumps>0)rock.landBounce=1;rock.y=fl;rock.vy=0;rock.jumps=0;}
  if(rock.landBounce>0)rock.landBounce=Math.max(0,rock.landBounce-.09);
  const rr=getRR();
  for(const o of obs){const oy=o.fly?o.y:GY-o.h;if(col(rr,{x:o.x+4,y:oy+4,w:o.w-8,h:o.h-4})){doGameOver();return;}}
  gems=gems.filter(g=>{if(col(rr,{x:g.x,y:g.y,w:g.sz,h:g.sz})){score+=20;spawnPart(g.x+g.sz/2,g.y+g.sz/2,'rgb(249,115,22)');return false;}return true;});
}
function doGameOver(){
  running=false;dead=true;let nb=false;
  if(score>S.best){S.best=score;nb=true;}
  document.getElementById('bestDisplay').textContent=String(S.best).padStart(5,'0');
  recordScore(S.username,score,S.googleUser?.sub||'guest');
  document.getElementById('goScore').textContent=`Score: ${score.toLocaleString()}  |  Best: ${S.best.toLocaleString()}`;
  document.getElementById('goBest').style.display=nb?'block':'none';
  document.getElementById('goOverlay').classList.remove('hidden');
  showToast(nb?`New best: ${S.best}!`:`Score: ${score}`);
}
function render(){ctx.clearRect(0,0,W,H);drawSky();drawGround();drawGems();drawObs();drawRocky();drawParts();drawHUD();}
function gameLoop(){update();render();requestAnimationFrame(gameLoop);}
function startGame(){
  score=0;speed=5;sTimer=0;oTimer=0;gTimer=0;obs=[];gems=[];parts=[];walkPhase=0;
  resetRock();running=true;dead=false;
  document.getElementById('startOverlay').classList.add('hidden');
  document.getElementById('goOverlay').classList.add('hidden');
  document.getElementById('scoreDisplay').textContent='00000';
}
document.addEventListener('keydown',e=>{
  if(['Space','ArrowUp'].includes(e.code)){e.preventDefault();if(!running&&!dead)startGame();else doJump();}
  if(e.code==='ArrowDown'){e.preventDefault();doDuck(true);}
});
document.addEventListener('keyup',e=>{if(e.code==='ArrowDown')doDuck(false);});
canvas.addEventListener('touchstart',e=>{e.preventDefault();if(!running&&!dead)startGame();else doJump();},{passive:false});
document.getElementById('btnPlay').addEventListener('click',startGame);
document.getElementById('btnRestart').addEventListener('click',startGame);
document.getElementById('mJump').addEventListener('click',()=>{if(!running&&!dead)startGame();else doJump();});
document.getElementById('mDuck').addEventListener('mousedown',()=>doDuck(true));
document.getElementById('mDuck').addEventListener('mouseup',()=>doDuck(false));
document.getElementById('mDuck').addEventListener('touchstart',()=>doDuck(true),{passive:true});
document.getElementById('mDuck').addEventListener('touchend',()=>doDuck(false),{passive:true});
gameLoop();



