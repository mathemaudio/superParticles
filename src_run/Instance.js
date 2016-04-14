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