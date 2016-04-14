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
