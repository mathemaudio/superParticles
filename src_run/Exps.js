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
