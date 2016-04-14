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
