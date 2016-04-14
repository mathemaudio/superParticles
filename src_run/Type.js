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