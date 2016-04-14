/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

// read about parameter types in a file "parameterTypes.js"
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

AddCondition(0, cf_none, "Is spraying", "Particle spray", "Is spraying", "True if the continuous spray is currently enabled.", "IsSpraying");

module.exports = {};