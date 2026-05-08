// Rocky Stone Golem - canvas drawn, matches reference PNG style
// Colors from reference image
const RC={
  out:'#1A0A02', dk:'#3D1E08', md:'#6B3A18',
  st:'#9B6030', lt:'#C8904A', hl:'#E8B870',
  jt:'#251005',  lg:'rgba(228,200,155,0.9)'
};

function drawRockyGolem(ctx,x,y,walkPhase,speed,ducking,jumping,landBounce){
  const spd=Math.min((speed-5)/11,1);
  const legSw=Math.sin(walkPhase)*(0.4+spd*0.3);
  const armSw=-legSw*0.6;
  const bob=ducking||jumping?0:Math.abs(Math.sin(walkPhase))*(4+spd*6);
  const lean=ducking?0.06:(jumping?-0.06:spd*0.1);
  const sqX=landBounce>0?1-landBounce*0.08:1;
  const sqY=landBounce>0?1+landBounce*0.13:1;

  ctx.save();
  ctx.translate(x,y-bob);
  ctx.scale(sqX,sqY);
  ctx.rotate(lean);

  if(ducking){
    _rDuck(ctx,spd);
  } else {
    _rShadow(ctx,jumping,spd);
    // Legs drawn behind body
    _rLeg(ctx,-10,10,-legSw,spd);
    _rLeg(ctx, 10,10, legSw,spd);
    // Body + head
    _rBody(ctx);
    _rHead(ctx,spd);
    // Arms drawn after body (in front)
    _rArm(ctx,-30,-6,-armSw,spd);
    _rArm(ctx, 30,-6, armSw,spd);
  }
  if(jumping){
    ctx.beginPath();ctx.ellipse(0,20,16,4,0,0,Math.PI*2);
    ctx.fillStyle='rgba(249,115,22,.2)';ctx.fill();
  }
  ctx.restore();
}

function _poly(ctx,pts){
  ctx.beginPath();ctx.moveTo(pts[0],pts[1]);
  for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);
  ctx.closePath();
}
function _fill(ctx,col,stroke,lw){
  ctx.fillStyle=col;ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1.5;ctx.stroke();}
}

function _rShadow(ctx,jumping,spd){
  ctx.beginPath();ctx.ellipse(0,22,18-spd*4,4,0,0,Math.PI*2);
  ctx.fillStyle=jumping?'rgba(0,0,0,.06)':'rgba(0,0,0,.22)';ctx.fill();
}

function _rHead(ctx,spd){
  // Main skull - large round stone
  ctx.beginPath();ctx.arc(0,-44,16,0,Math.PI*2);
  ctx.fillStyle=RC.md;ctx.fill();ctx.strokeStyle=RC.out;ctx.lineWidth=2;ctx.stroke();
  // Top crown stone (darker)
  _poly(ctx,[-8,-52,8,-52,10,-42,-10,-42]);
  _fill(ctx,RC.dk,RC.out,1.5);
  // Face stone (lighter, front-facing)
  ctx.beginPath();ctx.ellipse(1,-44,11,12,0,0,Math.PI*2);
  ctx.fillStyle=RC.st;ctx.fill();
  // Eyes - two small white dots
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-4,-43,2.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-43,2.5,0,Math.PI*2);ctx.fill();
  // Pupils
  ctx.fillStyle=RC.out;
  ctx.beginPath();ctx.arc(-4,-43,1.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-43,1.2,0,Math.PI*2);ctx.fill();
  // Brow ridge
  _poly(ctx,[-8,-51,8,-51,6,-47,-6,-47]);
  _fill(ctx,RC.dk,RC.out,1);
}

function _rBody(ctx){
  // Main torso - trapezoid (wider top)
  _poly(ctx,[-22,-38, 22,-38, 18,0, -18,0]);
  _fill(ctx,RC.md,RC.out,2);
  // Chest plate (lighter)
  _poly(ctx,[-16,-34, 16,-34, 13,-8, -13,-8]);
  _fill(ctx,RC.st,RC.out,1.5);
  // Chest center highlight
  _poly(ctx,[-9,-28, 9,-28, 7,-14, -7,-14]);
  _fill(ctx,RC.lt,null);
  // Seismic X/infinity logo
  ctx.strokeStyle=RC.lg;ctx.lineWidth=2.2;ctx.lineCap='round';
  // Left arc
  ctx.beginPath();ctx.arc(-3,-21,4,0.4,Math.PI+0.5);ctx.stroke();
  // Right arc  
  ctx.beginPath();ctx.arc(3,-21,4,Math.PI+0.4,0.5);ctx.stroke();
  // Dark waist/belt
  _poly(ctx,[-18,0, 18,0, 16,10, -16,10]);
  _fill(ctx,RC.jt,RC.out,1.5);
  // Shoulder pads - large rounded boulders
  // Left shoulder
  ctx.beginPath();ctx.arc(-26,-28,13,0,Math.PI*2);
  ctx.fillStyle=RC.dk;ctx.fill();ctx.strokeStyle=RC.out;ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.arc(-27,-30,8,0,Math.PI*2);
  ctx.fillStyle=RC.md;ctx.fill();
  // Right shoulder
  ctx.beginPath();ctx.arc(26,-28,13,0,Math.PI*2);
  ctx.fillStyle=RC.dk;ctx.fill();ctx.strokeStyle=RC.out;ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.arc(27,-30,8,0,Math.PI*2);
  ctx.fillStyle=RC.md;ctx.fill();
}

function _rArm(ctx,ox,oy,angle,spd){
  ctx.save();
  ctx.translate(ox,oy);
  ctx.rotate(angle);
  // Upper arm - narrow
  _poly(ctx,[-7,-2, 7,-2, 9,16, -7,16]);
  _fill(ctx,RC.dk,RC.out,1.5);
  // Elbow joint
  ctx.beginPath();ctx.arc(1,16,6,0,Math.PI*2);
  _fill(ctx,RC.jt,RC.out,1);
  // Lower arm - wider, the "hammer fist"
  ctx.save();ctx.translate(1,22);ctx.rotate(-angle*0.3);
  _poly(ctx,[-7,-5, 7,-5, 10,14, -8,14]);
  _fill(ctx,RC.md,RC.out,1.5);
  // Fist - large round boulder shape
  ctx.beginPath();ctx.arc(1,18,9,0,Math.PI*2);
  _fill(ctx,RC.lt,RC.out,1.5);
  ctx.beginPath();ctx.arc(-2,17,5,0,Math.PI*2);
  _fill(ctx,RC.hl,null);
  ctx.restore();
  ctx.restore();
}

function _rLeg(ctx,ox,oy,angle,spd){
  ctx.save();
  ctx.translate(ox,oy);
  ctx.rotate(angle);
  // Thigh
  _poly(ctx,[-7,0, 7,0, 8,16, -6,16]);
  _fill(ctx,RC.md,RC.out,1.5);
  // Knee
  ctx.beginPath();ctx.arc(1,17,5.5,0,Math.PI*2);
  _fill(ctx,RC.jt,RC.out,1);
  // Shin
  ctx.save();ctx.translate(0,22);ctx.rotate(-angle*0.4);
  _poly(ctx,[-6,-4, 6,-4, 7,12, -7,12]);
  _fill(ctx,RC.dk,RC.out,1.5);
  // Foot - large round boulder
  ctx.beginPath();ctx.arc(1,14,8,0,Math.PI*2);
  _fill(ctx,RC.lt,RC.out,1.5);
  ctx.beginPath();ctx.arc(3,14,5,0,Math.PI*2);
  _fill(ctx,RC.st,null);
  ctx.restore();
  ctx.restore();
}

function _rDuck(ctx,spd){
  // Crouched: body lower, arms out wide, legs bent
  ctx.save();ctx.scale(1.1,0.7);
  // Legs splayed
  _rLeg(ctx,-10,8,-0.55,spd);
  _rLeg(ctx, 10,8, 0.55,spd);
  _rBody(ctx);
  _rHead(ctx,spd);
  _rArm(ctx,-30,-4,-0.7,spd);
  _rArm(ctx, 30,-4, 0.7,spd);
  ctx.restore();
}
