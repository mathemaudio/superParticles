/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */

GetPluginSettings = function() {
  return {
    "name": "SuperParticles",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
    "id": "SuperParticles",			// this is used to identify this plugin and is saved to the project; never change it
    "version": "1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
    "description": "Particles on steroids",
    "author": "Scirra",
    "help url": "http://www.scirra.com/manual/135/particles",
    "category": "General",				// Prefer to re-use existing categories, but you can set anything here
    "type": "world",				// either "world" (appears in layout and is drawn), else "object"
    "rotatable": true,					// only used when "type" is "world".  Enables an angle property on the object.
    "flags": 0						// uncomment lines to enable flags...
      //	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
    | pf_texture			// object has a single texture (e.g. tiled background)
    | pf_position_aces		// compare/set/get x, y...
      //	| pf_size_aces			// compare/set/get width, height...
    | pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
    | pf_appearance_aces	// compare/set/get visible, opacity...
      //	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
    //| pf_animations			// enables the animations system.  See 'Sprite' for usage
    | pf_zorder_aces		// move to top, bottom, layer...
    | pf_effects
    | pf_predraw
  };
};