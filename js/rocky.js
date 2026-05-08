// Rocky Stone Golem - canvas drawn character
function drawRockyGolem(ctx, x, y, walkPhase, speed, ducking, jumping, landBounce) {
  const C1='#3D2008',C2='#6B4226',C3='#8B5E3C',C4='#A87850',C5='#C49A6A',BK='#1A0A00';
  const spd=Math.min((speed-5)/11,1);
  const walkSpd=0.18+spd*0.22;
  const swing=Math.sin(walkPhase)*Math.min(0.28,0.08+spd*0.22);
  const bob=ducking?0:(jumping?0:Math.abs(Math.sin(walkPhase))*(-2-spd*2));
  const sqX=landBounce>0?1-landBounce*0.08:1;
  const sqY=landBounce>0?1+landBounce*0.12:1;
  const lean=ducking?0.05:(jumping?-0.05:spd*0.12);

  ctx.save();
  ctx.translate(x,y+bob);
  ctx.scale(sqX,sqY);
  ctx.rotate(lean);

  if(ducking){
    // Duck: crouched form
    _drawBody(ctx,C1,C2,C3,C4,C5,BK,0,8,0.75);
    _drawHead(ctx,C1,C2,C3,C4,C5,BK,0,-20,0.75);
    _drawArm(ctx,C1,C2,C3,C4,BK,20,-8,-0.6,0.75);
    _drawArm(ctx,C1,C2,C3,C4,BK,-20,-8,0.6,0.75);
    _drawLeg(ctx,C1,C2,C3,C4,BK,10,14,-0.5,0.75);
    _drawLeg(ctx,C1,C2,C3,C4,BK,-10,14,0.5,0.75);
  } else {
    _drawShadow(ctx,jumping,spd);
    _drawLeg(ctx,C1,C2,C3,C4,BK,10,20,swing,1);
    _drawLeg(ctx,C1,C2,C3,C4,BK,-10,20,-swing,1);
    _drawBody(ctx,C1,C2,C3,C4,C5,BK,0,0,1);
    _drawArm(ctx,C1,C2,C3,C4,BK,24,-4,-swing*0.8,1);
    _drawArm(ctx,C1,C2,C3,C4,BK,-24,-4,swing*0.8,1);
    _drawHead(ctx,C1,C2,C3,C4,C5,BK,0,-28,1);
  }
  // Jump glow
  if(jumping){
    ctx.beginPath();ctx.ellipse(0,18,14,5,0,0,Math.PI*2);
    ctx.fillStyle='rgba(249,115,22,.25)';ctx.fill();
  }
  ctx.restore();
}

function _drawShadow(ctx,jumping,spd){
  const op=jumping?0.08:0.2-spd*0.05;
  ctx.beginPath();ctx.ellipse(0,22,16,4,0,0,Math.PI*2);
  ctx.fillStyle=`rgba(0,0,0,${op})`;ctx.fill();
}
function _poly(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();}

function _drawHead(ctx,C1,C2,C3,C4,C5,BK,ox,oy,sc){
  ctx.save();ctx.translate(ox,oy);ctx.scale(sc,sc);
  // Main head stone
  _poly(ctx,[-11,-10, 5,-13, 14,-5, 12,7, -7,9, -14,1]);
  ctx.fillStyle=C4;ctx.fill();ctx.strokeStyle=C1;ctx.lineWidth=1.5;ctx.stroke();
  // Dark forehead patch
  _poly(ctx,[-4,-10, 5,-12, 9,-5, -1,-4]);
  ctx.fillStyle=C2;ctx.fill();ctx.strokeStyle=C1;ctx.lineWidth=1;ctx.stroke();
  // Light chin
  _poly(ctx,[-6,3, 4,2, 6,8, -5,8]);
  ctx.fillStyle=C5;ctx.fill();
  // Eyes
  ctx.fillStyle=BK;
  ctx.beginPath();ctx.arc(-4,-2,2.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(4,-3,2.2,0,Math.PI*2);ctx.fill();
  // Eye shine
  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.beginPath();ctx.arc(-3,-3,0.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-4,0.8,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function _drawBody(ctx,C1,C2,C3,C4,C5,BK,ox,oy,sc){
  ctx.save();ctx.translate(ox,oy);ctx.scale(sc,sc);
  // Main torso
  _poly(ctx,[-20,-22, 20,-22, 24,10, -24,10]);
  ctx.fillStyle=C2;ctx.fill();ctx.strokeStyle=C1;ctx.lineWidth=1.5;ctx.stroke();
  // Chest plate
  _poly(ctx,[-14,-18, 14,-18, 16,4, -16,4]);
  ctx.fillStyle=C3;ctx.fill();ctx.strokeStyle=C1;ctx.lineWidth=1;ctx.stroke();
  // Chest highlight
  _poly(ctx,[-8,-14, 8,-14, 9,-2, -9,-2]);
  ctx.fillStyle=C4;ctx.fill();
  // Seismic X logo
  ctx.strokeStyle='rgba(255,255,255,0.65)';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-6,-12);ctx.lineTo(6,-2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(6,-12);ctx.lineTo(-6,-2);ctx.stroke();
  // Waist/hips
  _poly(ctx,[-16,10, 16,10, 14,18, -14,18]);
  ctx.fillStyle=C1;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1;ctx.stroke();
  // Shoulder pads
  _poly(ctx,[-24,-22, -14,-22, -12,-16, -22,-14]);
  ctx.fillStyle=C1;ctx.fill();ctx.strokeStyle=BK;ctx.stroke();
  _poly(ctx,[24,-22, 14,-22, 12,-16, 22,-14]);
  ctx.fillStyle=C1;ctx.fill();ctx.strokeStyle=BK;ctx.stroke();
  ctx.restore();
}
function _drawArm(ctx,C1,C2,C3,C4,BK,ox,oy,angle,sc){
  ctx.save();ctx.translate(ox,oy);ctx.scale(sc,sc);ctx.rotate(angle);
  // Upper arm
  _poly(ctx,[-7,-2, 7,-2, 9,16, -7,16]);
  ctx.fillStyle=C1;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1.5;ctx.stroke();
  // Elbow joint
  ctx.beginPath();ctx.arc(1,16,5,0,Math.PI*2);
  ctx.fillStyle=C3;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1;ctx.stroke();
  // Forearm
  ctx.save();ctx.translate(1,22);ctx.rotate(-angle*0.4);
  _poly(ctx,[-6,-4, 6,-4, 8,14, -6,14]);
  ctx.fillStyle=C2;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1;ctx.stroke();
  // Fist/hand
  _poly(ctx,[-8,12, 8,12, 9,22, -9,22]);
  ctx.fillStyle=C4;ctx.fill();ctx.strokeStyle=BK;ctx.stroke();
  ctx.restore();
  ctx.restore();
}
function _drawLeg(ctx,C1,C2,C3,C4,BK,ox,oy,angle,sc){
  ctx.save();ctx.translate(ox,oy);ctx.scale(sc,sc);ctx.rotate(angle);
  // Thigh
  _poly(ctx,[-8,0, 8,0, 9,18, -7,18]);
  ctx.fillStyle=C2;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1.5;ctx.stroke();
  // Knee
  ctx.beginPath();ctx.arc(1,18,5,0,Math.PI*2);
  ctx.fillStyle=C3;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1;ctx.stroke();
  // Shin
  ctx.save();ctx.translate(0,24);ctx.rotate(-angle*0.5);
  _poly(ctx,[-7,-4, 7,-4, 8,14, -8,14]);
  ctx.fillStyle=C1;ctx.fill();ctx.strokeStyle=BK;ctx.lineWidth=1;ctx.stroke();
  // Foot
  _poly(ctx,[-10,12, 10,12, 12,22, -12,22]);
  ctx.fillStyle=C4;ctx.fill();ctx.strokeStyle=BK;ctx.stroke();
  // Toe detail
  _poly(ctx,[2,18, 12,18, 12,22, 2,22]);
  ctx.fillStyle=C3;ctx.fill();
  ctx.restore();
  ctx.restore();
}
