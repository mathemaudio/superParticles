(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";


var deadparticles = require('./deadparticles');

/**
 * @extends Instance
 * @constructor
 */
function Acts() {}

var aproto = Acts.prototype;

aproto.SetSpraying = function (set_) {
  this.spraying = (set_ !== 0);
};

aproto.SetEffect = function (effect) {
  this.blend_mode = effect;
  this.compositeOp = cr.effectToCompositeOp(effect);
  cr.setGLBlend(this, effect, this.runtime.gl);
  this.runtime.redraw = true;
};

aproto.SetRate = function (x) {
  this.rate = x;
  var diff, i;

  // In one-shot mode, if still in the first tick, adjust the number of particles created
  if (this.spraytype === 1 && this.first_tick) {
    // Reducing particle count
    if (x < this.particles.length) {
      diff = this.particles.length - x;

      for (i = 0; i < diff; i++)
        deadparticles.push(this.particles.pop());
    }
    // Increasing particle count
    else if (x > this.particles.length) {
      diff = x - this.particles.length;

      for (i = 0; i < diff; i++)
        this.allocateParticle().opacity = 0;
    }
  }
};

aproto.SetSprayCone = function (x) { this.spraycone = cr.to_radians(x);};
aproto.SetInitSpeed = function (x) { this.initspeed = x;};
aproto.SetInitSize = function (x) { this.initsize = x;};
aproto.SetInitOpacity = function (x) { this.initopacity = x / 100;};
aproto.SetGrowRate = function (x) { this.growrate = x;};
aproto.SetXRandomiser = function (x) { this.xrandom = x;};
aproto.SetYRandomiser = function (x) { this.yrandom = x;};
aproto.SetSpeedRandomiser = function (x) { this.speedrandom = x;};
aproto.SetSizeRandomiser = function (x) { this.sizerandom = x;};
aproto.SetGrowRateRandomiser = function (x) { this.growrandom = x;};
aproto.SetParticleAcc = function (x) { this.acc = x;};
aproto.SetGravity = function (x) { this.g = x;};
aproto.SetAngleRandomiser = function (x) { this.lifeanglerandom = x;};
aproto.SetLifeSpeedRandomiser = function (x) { this.lifespeedrandom = x;};
aproto.SetOpacityRandomiser = function (x) { this.lifeopacityrandom = x;};
aproto.SetTimeout = function (x) { this.timeout = x;};


function listProps(title, obj){
  console.log(title);
  for(var k in obj)
    console.log(' |  '+k+' : '+(typeof obj[k]));
}

aproto.SetEmissionMap = function(map){
  var file=map.texture_file;
  console.log('typeof file: '+ typeof file);
  console.log('typeof file.getImageData'+ typeof (file.getImageData));
};


module.exports = new Acts();

},{"./deadparticles":7}],2:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";
// Conditions

/**
 * @extends Instance
 * @constructor
 */
function Cnds() {}

// the example condition
Cnds.prototype.IsSpraying = function () {
  return this.spraying;
};

module.exports = new Cnds();

},{}],3:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

/**
 * @extends Instance
 * @class
 */
function Exps() {}

Exps.prototype.ParticleCount = function (ret) { ret.set_int(this.particles.length); };
Exps.prototype.Rate = function (ret) { ret.set_float(this.rate); };
Exps.prototype.SprayCone = function (ret) { ret.set_float(cr.to_degrees(this.spraycone)); };
Exps.prototype.InitSpeed = function (ret) { ret.set_float(this.initspeed); };
Exps.prototype.InitSize = function (ret) { ret.set_float(this.initsize); };
Exps.prototype.InitOpacity = function (ret) { ret.set_float(this.initopacity * 100); };
Exps.prototype.InitGrowRate = function (ret) { ret.set_float(this.growrate); };
Exps.prototype.XRandom = function (ret) { ret.set_float(this.xrandom); };
Exps.prototype.YRandom = function (ret) { ret.set_float(this.yrandom); };
Exps.prototype.InitSpeedRandom = function (ret) { ret.set_float(this.speedrandom); };
Exps.prototype.InitSizeRandom = function (ret) { ret.set_float(this.sizerandom); };
Exps.prototype.InitGrowRandom = function (ret) { ret.set_float(this.growrandom); };
Exps.prototype.ParticleAcceleration = function (ret) { ret.set_float(this.acc); };
Exps.prototype.Gravity = function (ret) { ret.set_float(this.g); };
Exps.prototype.ParticleAngleRandom = function (ret) { ret.set_float(this.lifeanglerandom); };
Exps.prototype.ParticleSpeedRandom = function (ret) { ret.set_float(this.lifespeedrandom); };
Exps.prototype.ParticleOpacityRandom = function (ret) { ret.set_float(this.lifeopacityrandom); };
Exps.prototype.Timeout = function (ret) { ret.set_float(this.timeout); };

module.exports = new Exps();

},{}],4:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";


var SParticle = require('./SParticle');
var deadparticles = require('./deadparticles');

/////////////////////////////////////
/**
 * @param {Type} type
 * @extends InstanceBase
 * @class
 */
function Instance(type) {
  this.type = type;
  this.runtime = type.runtime;
}


var instanceProto = Instance.prototype;

// called whenever an instance is created
instanceProto.onCreate = function () {
  var props = this.properties;

  this.rate = props[0];
  this.spraycone = cr.to_radians(props[1]);
  this.spraytype = props[2];			// 0 = continuous, 1 = one-shot
  this.spraying = true;				// for continuous mode only

  this.initspeed = props[3];
  this.initsize = props[4];
  this.initopacity = props[5] / 100.0;
  this.growrate = props[6];
  this.xrandom = props[7];
  this.yrandom = props[8];
  this.speedrandom = props[9];
  this.sizerandom = props[10];
  this.growrandom = props[11];
  this.acc = props[12];
  this.g = props[13];
  this.lifeanglerandom = props[14];
  this.lifespeedrandom = props[15];
  this.lifeopacityrandom = props[16];
  this.destroymode = props[17];		// 0 = fade, 1 = timeout, 2 = stopped
  this.timeout = props[18];
  this.initSpin = props[19];
  this.initSpinRand = props[20];
  this.spinSpeed = props[21];
  this.spinSpeedRand = props[22];
  this.spinAcc = props[23];
  this.spinAccRand = props[24];
  this.fadeIn = props[25];
  this.fadeInRand = props[26];
  this.scaleIn = props[27];
  this.scaleInRand = props[28];


  this.particleCreateCounter = 0;
  this.particlescale = 1;

  // Dynamically set the bounding box to surround all created particles
  this.particleBoxLeft = this.x;
  this.particleBoxTop = this.y;
  this.particleBoxRight = this.x;
  this.particleBoxBottom = this.y;

  this.add_bbox_changed_callback(function (self) {
    self.bbox.set(self.particleBoxLeft, self.particleBoxTop, self.particleBoxRight, self.particleBoxBottom);
    self.bquad.set_from_rect(self.bbox);
    self.bbox_changed = false;
    self.update_collision_cell();
    self.update_render_cell();
  });

  // Check for recycling
  if (!this.recycled)
    this.particles = [];

  this.runtime.tickMe(this);

  this.type.loadTextures();

  // If in one-shot mode, create all particles now
  if (this.spraytype === 1) {
    for (var i = 0; i < this.rate; i++)
      this.allocateParticle().opacity = 0;
  }

  this.first_tick = true;		// for re-init'ing one-shot particles on first tick so they assume any new angle/position
};

instanceProto.saveToJSON = function () {
  var o = {
    "r": this.rate,
    "sc": this.spraycone,
    "st": this.spraytype,
    "s": this.spraying,
    "isp": this.initspeed,
    "isz": this.initsize,
    "io": this.initopacity,
    "gr": this.growrate,
    "xr": this.xrandom,
    "yr": this.yrandom,
    "spr": this.speedrandom,
    "szr": this.sizerandom,
    "grnd": this.growrandom,
    "acc": this.acc,
    "g": this.g,
    "lar": this.lifeanglerandom,
    "lsr": this.lifespeedrandom,
    "lor": this.lifeopacityrandom,
    "dm": this.destroymode,
    "to": this.timeout,
    "pcc": this.particleCreateCounter,
    "ft": this.first_tick,
    "_is": this.initSpin,
    "_isr": this.initSpinRand,
    "_ss": this.spinSpeed,
    "_ssr": this.spinSpeedRand,
    "_sa": this.spinAcc,
    "_sar": this.spinAccRand,
    "_fi": this.fadeIn,
    "_fir": this.fadeInRand,
    "_si": this.scaleIn,
    "_sir": this.scaleInRand,
    "p": []
  };

  var i, len, p;
  var arr = o["p"];

  for (i = 0, len = this.particles.length; i < len; i++) {
    p = this.particles[i];
    arr.push([p.x, p.y, p.speed, p.angle, p.opacity, p.grow, p.size, p.gs, p.age]);
  }

  return o;
};

instanceProto.loadFromJSON = function (o) {
  this.rate = o["r"];
  this.spraycone = o["sc"];
  this.spraytype = o["st"];
  this.spraying = o["s"];
  this.initspeed = o["isp"];
  this.initsize = o["isz"];
  this.initopacity = o["io"];
  this.growrate = o["gr"];
  this.xrandom = o["xr"];
  this.yrandom = o["yr"];
  this.speedrandom = o["spr"];
  this.sizerandom = o["szr"];
  this.growrandom = o["grnd"];
  this.acc = o["acc"];
  this.g = o["g"];
  this.lifeanglerandom = o["lar"];
  this.lifespeedrandom = o["lsr"];
  this.lifeopacityrandom = o["lor"];
  this.destroymode = o["dm"];
  this.timeout = o["to"];
  this.particleCreateCounter = o["pcc"];
  this.first_tick = o["ft"];

  this.initSpin = "_is";
  this.initSpinRand = o["_isr"];
  this.spinSpeed = o["_ss"];
  this.spinSpeedRand = o["_ssr"];
  this.spinAcc = o["_sa"];
  this.spinAccRand = o["_sar"];
  this.fadeIn = o["_fi"];
  this.fadeInRand = o["_fir"];
  this.scaleIn = o["_si"];
  this.scaleInRand = o["_sir"];


  // recycle all particles then load by reallocating them
  deadparticles.push.apply(deadparticles, this.particles);
  cr.clearArray(this.particles);

  var i, len, p, d;
  var arr = o["p"];

  for (i = 0, len = arr.length; i < len; i++) {
    p = this.allocateParticle();
    d = arr[i];
    p.x = d[0];
    p.y = d[1];
    p.speed = d[2];
    p.angle = d[3];
    p.opacity = d[4];
    p.grow = d[5];
    p.size = d[6];
    p.gs = d[7];
    p.age = d[8];
  }
};

instanceProto.onDestroy = function () {
  // recycle all particles
  deadparticles.push.apply(deadparticles, this.particles);
  cr.clearArray(this.particles);
};

instanceProto.allocateParticle = function () {
  var p;

  if (deadparticles.length) {
    p = deadparticles.pop();
    p.owner = this;
  }
  else
    p = new SParticle(this);

  this.particles.push(p);
  p.active = true;
  return p;
};

instanceProto.tick = function () {
  var dt = this.runtime.getDt(this);
  var i, len, p, n, j;

  // Create spray particles for this tick
  if (this.spraytype === 0 && this.spraying) {
    this.particleCreateCounter += dt * this.rate;

    n = cr.floor(this.particleCreateCounter);
    this.particleCreateCounter -= n;

    for (i = 0; i < n; i++) {
      p = this.allocateParticle();
      p.init();
    }
  }

  this.particleBoxLeft = this.x;
  this.particleBoxTop = this.y;
  this.particleBoxRight = this.x;
  this.particleBoxBottom = this.y;

  for (i = 0, j = 0, len = this.particles.length; i < len; i++) {
    p = this.particles[i];
    this.particles[j] = p;

    this.runtime.redraw = true;

    // If the first tick for one-shot particles, call init() now so the particles
    // assume any changed position or angle of the SuperParticles object.
    if (this.spraytype === 1 && this.first_tick)
      p.init();

    p.tick(dt);

    // SParticle is dead: move to deadparticles for later recycling
    if (!p.active) {
      deadparticles.push(p);
      continue;
    }

    // measure bounding box
    if (p.left() < this.particleBoxLeft)
      this.particleBoxLeft = p.left();
    if (p.right() > this.particleBoxRight)
      this.particleBoxRight = p.right();
    if (p.top() < this.particleBoxTop)
      this.particleBoxTop = p.top();
    if (p.bottom() > this.particleBoxBottom)
      this.particleBoxBottom = p.bottom();

    j++;
  }

  cr.truncateArray(this.particles, j);

  // Update the bounding box based on active particles
  this.set_bbox_changed();

  this.first_tick = false;

  // If one-shot and all particles are dead, destroy the whole object
  if (this.spraytype === 1 && this.particles.length === 0)
    this.runtime.DestroyInstance(this);
};

// only called if a layout object - draw to a canvas 2D context
instanceProto.draw = function (ctx) {
  var i, len, p, layer = this.layer;

  for (i = 0, len = this.particles.length; i < len; i++) {
    p = this.particles[i];

    // Only draw active and on-screen particles
    if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom) {
      p.draw(ctx);
    }
  }
};

// only called if a layout object in WebGL mode - draw to the WebGL context
// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
// directory or just copy what other plugins do.
instanceProto.drawGL = function (glw) {
  this.particlescale = this.layer.getScale();
  glw.setTexture(this.type.webGL_texture);

  var i, len, p, layer = this.layer;

  for (i = 0, len = this.particles.length; i < len; i++) {
    p = this.particles[i];

    // Only draw active and on-screen particles
    if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom) {
      p.drawGL(glw);
    }
  }
};

/**BEGIN-PREVIEWONLY**/
instanceProto.getDebuggerValues = function (propsections) {
  propsections.push({
    "title": "SuperParticles",
    "properties": [
      {"name": "SParticle count", "value": this.particles.length, "readonly": true},
      {"name": "Type", "value": (this.spraytype === 0 ? "Continuous" : "One-shot"), "readonly": true},
      {"name": "Is spraying", "value": this.spraying},
      {"name": "Rate", "value": this.rate},
      {"name": "Spray cone", "value": cr.to_degrees(this.spraycone)},
      {"name": "Speed", "value": this.initspeed},
      {"name": "Size", "value": this.initsize},
      {"name": "Opacity", "value": this.initopacity * 100},
      {"name": "Grow rate", "value": this.growrate},
      {"name": "X randomiser", "value": this.xrandom},
      {"name": "Y randomiser", "value": this.yrandom},
      {"name": "Speed randomiser", "value": this.speedrandom},
      {"name": "Size randomiser", "value": this.sizerandom},
      {"name": "Grow randomiser", "value": this.growrandom},
      {"name": "Acceleration", "value": this.acc},
      {"name": "Gravity", "value": this.g},
      {"name": "Lifetime angle randomiser", "value": this.lifeanglerandom},
      {"name": "Lifetime speed randomiser", "value": this.lifespeedrandom},
      {"name": "Lifetime opacity randomiser", "value": this.lifeopacityrandom},
      {"name": "Timeout", "value": this.timeout}
    ]
  });
};

instanceProto.onDebugValueEdited = function (header, name, value) {
  switch (name) {
    case "Is spraying":
      this.spraying = value;
      break;
    case "Rate":
      this.rate = value;
      break;
    case "Spray cone":
      this.spraycone = cr.to_radians(value);
      break;
    case "Speed":
      this.initspeed = value;
      break;
    case "Size":
      this.initsize = value;
      break;
    case "Opacity":
      this.initopacity = value / 100;
      break;
    case "Grow rate":
      this.growrate = value;
      break;
    case "X randomiser":
      this.xrandom = value;
      break;
    case "Y randomiser":
      this.yrandom = value;
      break;
    case "Speed randomiser":
      this.speedrandom = value;
      break;
    case "Size randomiser":
      this.sizerandom = value;
      break;
    case "Grow randomiser":
      this.growrandom = value;
      break;
    case "Acceleration":
      this.acc = value;
      break;
    case "Gravity":
      this.g = value;
      break;
    case "Lifetime angle randomiser":
      this.lifeanglerandom = value;
      break;
    case "Lifetime speed randomiser":
      this.lifespeedrandom = value;
      break;
    case "Lifetime opacity randomiser":
      this.lifeopacityrandom = value;
      break;
    case "Timeout":
      this.timeout = value;
      break;
  }
};
/**END-PREVIEWONLY**/


module.exports = Instance;
},{"./SParticle":5,"./deadparticles":7}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
// Object type class
/**
 *
 * @param {Plugin} plugin
 * @extends TypeBase
 * @class
 */
function Type(plugin) {
  this.plugin = plugin;
  this.runtime = plugin.runtime;
  this.webGL_texture = null;
}


// called on startup for each object type
Type.prototype.onCreate = function () {
  if (this.is_family)
    return;

  // Create the texture
  this.texture_img = new Image();
  this.texture_img.cr_filesize = this.texture_filesize;
  this.webGL_texture = null;

  // Tell runtime to wait for this to load
  this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
};

Type.prototype.onLostWebGLContext = function () {
  if (this.is_family)
    return;

  this.webGL_texture = null;
};

Type.prototype.onRestoreWebGLContext = function () {
  // No need to create textures if no instances exist, will create on demand
  if (this.is_family || !this.instances.length)
    return;

  if (!this.webGL_texture) {
    this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
  }
};

Type.prototype.loadTextures = function () {
  if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
    return;

  this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
};

Type.prototype.unloadTextures = function () {
  if (this.is_family || this.instances.length || !this.webGL_texture)
    return;

  this.runtime.glwrap.deleteTexture(this.webGL_texture);
  this.webGL_texture = null;
};

Type.prototype.preloadCanvas2D = function (ctx) {
  // draw to preload, browser should lazy load the texture
  ctx.drawImage(this.texture_img, 0, 0);
};

module.exports = Type;
},{}],7:[function(require,module,exports){
/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

/**
 * global array of particles to recycle
 * @type {Array}
 */
var deadparticles = [];



module.exports = deadparticles;



},{}],8:[function(require,module,exports){
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
/**
 * @param {Runtime} runtime
 * @class Plugin
 * @extends PluginBase */
cr.plugins_.SuperParticles = function (runtime) {
  this.runtime = runtime;

};
var plug = cr.plugins_.SuperParticles.prototype;
plug.Type = require('./Type');
plug.Instance = require('./Instance');
plug.cnds = require('./Cnds');
plug.acts = require('./Acts');
plug.exps = require('./Exps');

},{"./Acts":1,"./Cnds":2,"./Exps":3,"./Instance":4,"./Type":6}]},{},[8]);
