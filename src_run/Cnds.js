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
