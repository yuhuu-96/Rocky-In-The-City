// Rocky Stone Golem - pixel-accurate canvas recreation of reference PNG
// Colors: 5-value brown stone palette
const _C={
  bg:  '#0D0502',   // outline
  d1:  '#291208',   // darkest brown (shadow joints)
  d2:  '#4A2410',   // dark brown (main dark body)
  m1:  '#7A4520',   // medium brown (chest base)
  m2:  '#9B6030',   // stone face
  l1:  '#C49050',   // light tan face
  l2:  '#E0B878',   // highlight / specular
  lgo: 'rgba(225,195,145,0.92)'  // logo
};
function _p(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();}
function _f(ctx,c,s,w){ctx.fillStyle=c;ctx.fill();if(s){ctx.strokeStyle=s;ctx.lineWidth=w||1.6;ctx.stroke();}}

function drawRockyGolem(ctx,x,y,walkPhase,speed,ducking,jumping,landBounce){
  const spd=Math.min((speed-5)/11,1);
  const legSw=Math.sin(walkPhase)*(0.38+spd*0.28);
  const armSw=-legSw*0.45;
  const bob=ducking||jumping?0:Math.abs(Math.sin(walkPhase))*(3+spd*5);
  const lean=ducking?0.04:(jumping?-0.05:spd*0.07);
  const sqX=landBounce>0?1-landBounce*0.08:1;
  const sqY=landBounce>0?1+landBounce*0.12:1;

  ctx.save();
  ctx.translate(x,y-bob);
  ctx.scale(sqX,sqY);
  ctx.rotate(lean);

  if(ducking){_drawDuck(ctx,spd);}
  else{
    _shadow(ctx,jumping,spd);
    _legs(ctx,legSw,spd);
    _pelvis(ctx);
    _body(ctx);
    _arms(ctx,armSw,spd);
    _head(ctx);
    if(jumping){ctx.beginPath();ctx.ellipse(0,24,16,4,0,0,Math.PI*2);ctx.fillStyle='rgba(249,115,22,.15)';ctx.fill();}
  }
  ctx.restore();
}

function _shadow(ctx,jumping,spd){
  ctx.beginPath();ctx.ellipse(0,25,18-spd*3,4,0,0,Math.PI*2);
  ctx.fillStyle=jumping?'rgba(0,0,0,.05)':'rgba(0,0,0,.2)';ctx.fill();
}

function _head(ctx){
  // Faceted angular stone head - small, sits on chest
  _p(ctx,[-9,-52, 3,-57, 11,-52, 10,-42, -10,-42]);
  _f(ctx,_C.m1,_C.bg,1.8);
  // Top dark facet
  _p(ctx,[-9,-52, 3,-57, 11,-52, 6,-50, -4,-50]);
  _f(ctx,_C.d2,_C.bg,1);
  // Front lighter facet
  _p(ctx,[-8,-50, 6,-50, 8,-43, -8,-43]);
  _f(ctx,_C.m2,_C.bg,1);
  // Right side lighter
  _p(ctx,[6,-50, 10,-52, 10,-43, 8,-43]);
  _f(ctx,_C.l1,_C.bg,1);
  // Eyes (two white dots)
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-2,-47,2.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-47,2.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=_C.bg;
  ctx.beginPath();ctx.arc(-2,-47,1.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-47,1.1,0,Math.PI*2);ctx.fill();
}

function _body(ctx){
  // Main chest trapezoid (wider at top)
  _p(ctx,[-24,-40, 24,-40, 20,-4, -20,-4]);
  _f(ctx,_C.m1,_C.bg,2);
  // Central lighter chest plate
  _p(ctx,[-15,-36, 15,-36, 12,-8, -12,-8]);
  _f(ctx,_C.m2,_C.bg,1.5);
  // Center highlight panel
  _p(ctx,[-8,-30, 8,-30, 6,-14, -6,-14]);
  _f(ctx,_C.l1,null);
  // Seismic ∞ / connected arcs logo
  ctx.strokeStyle=_C.lgo;ctx.lineWidth=2.2;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(-4,-22,4.5,0.5,Math.PI+0.5);ctx.stroke();
  ctx.beginPath();ctx.arc( 4,-22,4.5,Math.PI+0.5,0.5);ctx.stroke();
  // Left shoulder black gap (connects body to shoulder pad)
  _p(ctx,[-24,-40,-14,-40,-20,-24,-28,-20,-30,-28]);
  _f(ctx,_C.d1,_C.bg,1.5);
  // Right shoulder black gap
  _p(ctx,[24,-40,14,-40,20,-24,28,-20,30,-28]);
  _f(ctx,_C.d1,_C.bg,1.5);
  // Left shoulder pad (large angular boulder)
  _p(ctx,[-28,-40,-16,-46,-10,-38,-14,-22,-30,-18,-38,-26,-36,-40]);
  _f(ctx,_C.d2,_C.bg,2);
  _p(ctx,[-28,-40,-16,-46,-14,-40,-24,-38]);
  _f(ctx,_C.m1,_C.bg,1);
  _p(ctx,[-14,-40,-10,-38,-14,-28,-20,-32]);
  _f(ctx,_C.m2,null);
  // Right shoulder pad
  _p(ctx,[28,-40,16,-46,10,-38,14,-22,30,-18,38,-26,36,-40]);
  _f(ctx,_C.d2,_C.bg,2);
  _p(ctx,[28,-40,16,-46,14,-40,24,-38]);
  _f(ctx,_C.m1,_C.bg,1);
  _p(ctx,[14,-40,10,-38,14,-28,20,-32]);
  _f(ctx,_C.m2,null);
  // Dark waist belt
  _p(ctx,[-20,-4, 20,-4, 18,6, -18,6]);
  _f(ctx,_C.d1,_C.bg,1.5);
}

function _pelvis(ctx){
  // Pelvis block connecting body to legs
  _p(ctx,[-16,6, 16,6, 14,16, -14,16]);
  _f(ctx,_C.d2,_C.bg,1.5);
  _p(ctx,[-10,8, 10,8, 9,15, -9,15]);
  _f(ctx,_C.m1,null);
}

function _arms(ctx,armSw,spd){
  _drawArm(ctx,-1,armSw,spd);  // left
  _drawArm(ctx, 1,-armSw,spd); // right
}
function _drawArm(ctx,side,angle,spd){
  const ox=side<0?-32:32;
  ctx.save();
  ctx.translate(ox,-24);
  ctx.rotate(angle);
  // Upper arm (narrow, dark, mostly hidden by shoulder pad)
  _p(ctx,[-5,-2,5,-2,6,12,-5,12]);
  _f(ctx,_C.d2,_C.bg,1.5);
  // Forearm (thick, angular)
  ctx.save();ctx.translate(0,14);ctx.rotate(-angle*0.25);
  _p(ctx,[-7,-2,7,-2,9,15,-9,15]);
  _f(ctx,_C.m1,_C.bg,1.5);
  _p(ctx,[0,-1,6,0,7,8,-1,8]);
  _f(ctx,_C.l1,null);
  // Large club-fist (big rounded boulder)
  ctx.save();ctx.translate(0,18);
  ctx.beginPath();ctx.ellipse(0,0,10,11,0,0,Math.PI*2);
  _f(ctx,_C.d2,_C.bg,1.8);
  ctx.beginPath();ctx.ellipse(-2,-2,7,7,0,0,Math.PI*2);
  _f(ctx,_C.l1,null);
  ctx.beginPath();ctx.ellipse(-3,-3,4,4,0,0,Math.PI*2);
  _f(ctx,_C.l2,null);
  ctx.restore();
  ctx.restore();
  ctx.restore();
}

function _legs(ctx,legSw,spd){
  _drawLeg(ctx,-1, legSw,spd);  // left leg
  _drawLeg(ctx, 1,-legSw,spd);  // right leg
}
function _drawLeg(ctx,side,angle,spd){
  const ox=side<0?-9:9;
  ctx.save();
  ctx.translate(ox,16);
  ctx.rotate(angle);
  // Thigh
  _p(ctx,[-7,0,7,0,8,14,-7,14]);
  _f(ctx,_C.m1,_C.bg,1.5);
  _p(ctx,[0,0,6,1,6,10,0,9]);
  _f(ctx,_C.l1,null);
  // Knee angular bump
  _p(ctx,[-6,13,6,13,7,19,-7,19]);
  _f(ctx,_C.d2,_C.bg,1.5);
  // Shin
  ctx.save();ctx.translate(0,20);ctx.rotate(-angle*0.4);
  _p(ctx,[-6,-1,6,-1,7,11,-7,11]);
  _f(ctx,_C.d2,_C.bg,1.5);
  // Large foot boulder
  ctx.save();ctx.translate(0,12);
  ctx.beginPath();ctx.ellipse(0,0,10,9,0,0,Math.PI*2);
  _f(ctx,_C.m2,_C.bg,1.8);
  ctx.beginPath();ctx.ellipse(-2,-2,7,5,0,0,Math.PI*2);
  _f(ctx,_C.l1,null);
  ctx.beginPath();ctx.ellipse(-3,-3,4,3,0,0,Math.PI*2);
  _f(ctx,_C.l2,null);
  ctx.restore();
  ctx.restore();
  ctx.restore();
}

function _drawDuck(ctx,spd){
  ctx.save();ctx.scale(1.15,0.72);
  _shadow(ctx,false,spd);
  _drawLeg(ctx,-1, 0.55,spd);
  _drawLeg(ctx, 1,-0.55,spd);
  _pelvis(ctx);
  _body(ctx);
  _head(ctx);
  _drawArm(ctx,-1,-0.65,spd);
  _drawArm(ctx, 1, 0.65,spd);
  ctx.restore();
}
