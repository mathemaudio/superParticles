/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";
var incID=0;
/**
 *
 * @param owner
 * @constructor
 */
function SParticle(owner) {
  this.id = incID++;
  //console.log('Particle #'+this.id);
  this.owner = owner;
  this.active = false;
  this.x = 0.;
  this.y = 0.;
  this.speed = 0.;
  this.angle = 0.;
  this.opacity = 1.;
  this.grow = 0.;
  this.size = 0.;
  this.halfSize = 0;
  this.gs = 0.;			// gravity speed
  this.age = 0.;
  this.spin = 0.;
  this.spinSpeed = 0.;
  this.fadeInRand = 0.;
  this.fadeIn = 0.;

  /** @type {Array.<Vector2>}   */
  this.corners = [new cr.vector2(0, 0), new cr.vector2(0, 0), new cr.vector2(0, 0), new cr.vector2(0, 0)];
  cr.seal(this);
}

SParticle.prototype.init = function () {
  var owner = this.owner;
  this.x = owner.x - (owner.xrandom / 2) + (Math.random() * owner.xrandom);
  this.y = owner.y - (owner.yrandom / 2) + (Math.random() * owner.yrandom);

  this.speed = owner.initspeed - (owner.speedrandom / 2) + (Math.random() * owner.speedrandom);
  this.angle = owner.angle - (owner.spraycone / 2) + (Math.random() * owner.spraycone);
  this.opacity = owner.initopacity;
  this.size = owner.initsize - (owner.sizerandom / 2) + (Math.random() * owner.sizerandom);
  this.halfSize = this.size / 2;
  this.grow = owner.growrate - (owner.growrandom / 2) + (Math.random() * owner.growrandom);
  this.gs = 0;
  this.age = 0;
  var randCenter = function () { return Math.random() - .5; };
  this.spin = owner.initSpin + owner.initSpinRand * randCenter();
  this.spinSpeed = owner.spinSpeed + owner.spinSpeedRand * randCenter();
  this.spinAcc = owner.spinAcc + owner.spinAccRand * randCenter();
  this.fadeInRand = owner.fadeIn + owner.fadeInRand * Math.random();
  this.fadeAddFactor = 1 / Math.max(this.fadeInRand, .0001);
  this.fadeIn = 0.;

  this.scaleInRand = owner.scaleIn + owner.scaleInRand * Math.random();
  this.scaleAddFactor = 1 / Math.max(this.scaleInRand, .0001);
  this.scaleIn = 0.;
};

SParticle.prototype.tick = function (dt) {
  var owner = this.owner;
  //if(this.id==0)    console.log(dt);
  // Move
  this.x += Math.cos(this.angle) * this.speed * dt;
  this.y += Math.sin(this.angle) * this.speed * dt;

  // Apply gravity
  this.y += this.gs * dt;

  // Adjust lifetime parameters
  this.speed += owner.acc * dt;
  this.size += this.grow * dt;
  this.gs += owner.g * dt;
  this.age += dt;

  this.spinSpeed *= this.spinAcc;
  this.spin += this.spinSpeed * dt * 60;
  //console.log('owner.fadeIn = ' + owner.fadeIn);
  if (this.fadeIn < 1)
    this.fadeIn = Math.min(1, this.fadeIn + this.fadeAddFactor * dt);
  //if(this.id==0)    console.log('fadeIn = '+this.fadeIn);

  if (this.scaleIn < 1) {
    this.scaleIn = Math.min(1, this.scaleIn + this.scaleAddFactor * dt);
  }

  // Destroy particle if shrunk to less than a pixel in size
  if (this.size < 1) {
    this.active = false;
    return;
  }

  if (owner.lifeanglerandom !== 0)
    this.angle += (Math.random() * owner.lifeanglerandom * dt) - (owner.lifeanglerandom * dt / 2);

  if (owner.lifespeedrandom !== 0)
    this.speed += (Math.random() * owner.lifespeedrandom * dt) - (owner.lifespeedrandom * dt / 2);

  if (owner.lifeopacityrandom !== 0) {
    this.opacity += (Math.random() * owner.lifeopacityrandom * dt) - (owner.lifeopacityrandom * dt / 2);


    if (this.opacity < 0)
      this.opacity = 0;
    else if (this.opacity > 1)
      this.opacity = 1;
  }

  // Make inactive after timeout for both fade and timeout settings
  if (owner.destroymode <= 1 && this.age >= owner.timeout) {
    this.active = false;
  }
  // Or make inactive when stopped
  if (owner.destroymode === 2 && this.speed <= 0) {
    this.active = false;
  }
};


SParticle.prototype.getOpacity = function () {
  return this.owner.opacity * this.opacity * this.fadeIn;
};
SParticle.prototype.draw = function (ctx) {
  var curopacity = this.getOpacity();

  if (curopacity === 0)
    return;

  // Modify opacity for fade-out
  if (this.owner.destroymode === 0)
    curopacity *= 1 - (this.age / this.owner.timeout);

  ctx.globalAlpha = curopacity;

  var drawx = this.x - this.halfSize;
  var drawy = this.y - this.halfSize;

  if (this.owner.runtime.pixel_rounding) {
    drawx = (drawx + 0.5) | 0;
    drawy = (drawy + 0.5) | 0;
  }


  var image = this.owner.type.texture_img;
  //ctx.drawImage(this.owner.type.texture_img, drawx, drawy, this.size, this.size);


  ctx.save();

  // move to the middle of where we want to draw our image
  ctx.translate(drawx, drawy);

  // rotate around that point, converting our
  // angle from degrees to radians
  ctx.rotate(this.spin * Math.PI / 180.);

  // draw it up and to the left by half the width
  // and height of the image
  var half = -(this.halfSize) * this.scaleIn;
  ctx.drawImage(image, half, half, this.size, this.size);

  // and restore the co-ords to how they were when we began
  ctx.restore();


};


//function r10(v) {
//  const a = 100;
//  return Math.round(v * a) / a;
//}

/**
 * rotates the point around 0,0
 * @param {Vector2} p
 * @param {number} angle
 */
function rotateAround(p, angle) {
  var pi = Math.PI;
  var radians = angle * pi / 180.,
    cos = Math.cos(radians),
    sin = Math.sin(radians);
  //console.log('angle: '+ r10(angle)+ ', cos:'+r10(cos)+', sin:'+r10(sin));
  var x = p.x;
  p.x = (cos * (x)) - (sin * (p.y));
  p.y = (sin * (x)) + (cos * (p.y));

}

SParticle.prototype.drawGL = function (glw) {
  var curopacity = this.getOpacity();
  // Modify opacity for fade-out
  if (this.owner.destroymode === 0)
    curopacity *= 1 - (this.age / this.owner.timeout);

  var drawsize = this.size * this.scaleIn;
  var scaleddrawsize = drawsize * this.owner.particlescale;

  var hds = drawsize / 2;
  var co = this.corners;
  var rot = this.spin/*+=6*/;
  var setCo = function (pos, x, y) {
    var a = co[pos];
    a.x = x;
    a.y = y;
    rotateAround(a, rot);
  };
  setCo(0, -hds, -hds);
  setCo(1, hds, -hds);
  setCo(2, hds, hds);
  setCo(3, -hds, hds);
  var x = this.x, y = this.y;

  var rounding = this.owner.runtime.pixel_rounding;
  for (var i = 0; i < co.length; ++i) {
    co[i].x += x;
    co[i].y += y;
    if (rounding) {
      co[i].x = (co[i].x + .5) | 0;
      co[i].y = (co[i].y + .5) | 0;
    }
  }


  // Don't bother issuing a quad for a particle smaller than 1px, it probably won't be visible anyway.
  if (scaleddrawsize < 1 || curopacity === 0)
    return;

  // Quad if outside the allowed point range, otherwise issue a point.  Hopefully there won't be too much
  // quad <-> point batch switching.  Note we have to manually scale particles which don't take in to account
  // the layout zoom etc. otherwise.
  //if (scaleddrawsize < glw.minPointSize || scaleddrawsize > glw.maxPointSize)
  {
    glw.setOpacity(curopacity);
    //			(tlx, 	tly, 	 trx,              try_,  brx,              bry,              blx,   bly             )
    //glw.quad(drawx, drawy, drawx + drawsize, drawy, drawx + drawsize, drawy + drawsize, drawx, drawy + drawsize);
    //glw.point(x + co[0].x, y + co[0].y, 11, 1);
    //glw.point(x + co[3].x, y + co[3].y, 11, 1);
    glw.quad(
      co[0].x, co[0].y,
      co[1].x, co[1].y,
      co[2].x, co[2].y,
      co[3].x, co[3].y
    );
  }
  //else	glw.point(this.x, this.y, scaleddrawsize, curopacity);
};

SParticle.prototype.left = function () {  return this.x - this.halfSize;};
SParticle.prototype.right = function () {  return this.x + this.halfSize;};
SParticle.prototype.top = function () {  return this.y - this.halfSize;};
SParticle.prototype.bottom = function () {  return this.y + this.halfSize;};

module.exports = SParticle;