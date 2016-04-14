/* @flow */
/**
 *
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

var props = require('./properties');

/**
 * Class representing an individual instance of an object in the IDE
 * @param {EditInstance} instance
 * @param {*=} type
 * @constructor
 */
function IDEInstance(instance, type) {
  //assert2(this instanceof arguments.callee, "Constructor called as a function");

  // Save the constructor parameters
  this.instance = instance;
  this.type = type;

  // Set the default property values from the property table
  this.properties = {};

  for (var i = 0; i < props.length; i++)
    this.properties[props[i].name] = props[i].initial_value;
}

IDEInstance.prototype.OnCreate = function () {
  // Always use middle-left hotspot
  this.instance.SetHotspot(new cr.vector2(0, 0.5));
};

IDEInstance.prototype.OnInserted = function () {
  this.instance.SetSize(new cr.vector2(128, 128));
};

IDEInstance.prototype.OnDoubleClicked = function () {
  this.instance.EditTexture();
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function (property_name) {
  // Edit image link
  if (property_name === "Image") {
    this.instance.EditTexture();
  }
};

IDEInstance.prototype.OnRendererInit = function (renderer) {
  renderer.LoadTexture(this.instance.GetTexture());
};

// Called to draw self in the editor
/**
 *
 * @param {EditRenderer} renderer
 * @constructor
 */
IDEInstance.prototype.Draw = function (renderer) {
  var texture = this.instance.GetTexture();
  renderer.SetTexture(this.instance.GetTexture());
  var sz = texture.GetImageSize();

  // Draw particle image in middle
  var q = this.instance.GetBoundingQuad();
  var imgx = cr.quad.prototype.midX.apply(q) - sz.x / 2;
  var imgy = cr.quad.prototype.midY.apply(q) - sz.y / 2;
  var q2 = new cr.quad();
  q2.set_from_rect(new cr.rect(imgx, imgy, imgx + sz.x, imgy + sz.y));

  renderer.Quad(q2, this.instance.GetOpacity());

  // Draw lines indicating spray cone, 100px long
  var origin = new cr.vector2((q.tlx + q.blx) / 2, (q.tly + q.bly) / 2);

  var a = this.instance.GetAngle();
  var da = cr.to_radians(this.properties["Spray cone"]) / 2;

  [1, -1,.95, -.95].forEach(function(tilt){
    var p= new cr.vector2(origin.x + Math.cos(a - da*tilt) * 100, origin.y + Math.sin(a + da*tilt) * 100);
    renderer.Line(origin, p, cr.RGB(255, 0, 255));
  });

  //var end1 = new cr.vector2(origin.x + Math.cos(a - da) * 100, origin.y + Math.sin(a - da) * 100);
  //var end2 = new cr.vector2(origin.x + Math.cos(a + da) * 100, origin.y + Math.sin(a + da) * 100);
  //renderer.Line(origin, end2, cr.RGB(255, 0, 0));
};

IDEInstance.prototype.OnRendererReleased = function (renderer) {
  renderer.ReleaseTexture(this.instance.GetTexture());
};

module.exports = IDEInstance;