/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";

// read about parameter types in a file "parameterTypes.js"

// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "Get particle count", "Particle spray", "ParticleCount", "Return the number of particles.");
AddExpression(1, ef_return_number, "Get rate", "Particle spray", "Rate", "The number of particles created per second.");
AddExpression(2, ef_return_number, "Get spray cone", "Particle spray", "SprayCone", "The number of degrees through which particles are created.");

AddExpression(3, ef_return_number, "Get speed", "Initial particle properties", "InitSpeed", "The initial particle speed, in pixels per second.");
AddExpression(4, ef_return_number, "Get size", "Initial particle properties", "InitSize", "The initial particle size, in pixels.");
AddExpression(5, ef_return_number, "Get opacity", "Initial particle properties", "InitOpacity", "The initial particle opacity, from 0 (transparent) to 100 (opaque).");
AddExpression(6, ef_return_number, "Get grow rate", "Initial particle properties", "InitGrowRate", "The initial particle grow rate, in pixels per second.");
AddExpression(7, ef_return_number, "Get X randomiser", "Initial particle properties", "XRandom", "The random X offset on creation.");
AddExpression(8, ef_return_number, "Get Y randomiser", "Initial particle properties", "YRandom", "The random Y offset on creation.");
AddExpression(9, ef_return_number, "Get speed randomiser", "Initial particle properties", "InitSpeedRandom", "The random addition to particle speed on creation.");
AddExpression(10, ef_return_number, "Get size randomiser", "Initial particle properties", "InitSizeRandom", "The random addition to particle size on creation.");
AddExpression(11, ef_return_number, "Get grow rate randomiser", "Initial particle properties", "InitGrowRandom", "The random addition to particle grow rate on creation.");

AddExpression(12, ef_return_number, "Get acceleration", "Particle lifetime properties", "ParticleAcceleration", "The particle acceleration in pixels per second per second.");
AddExpression(13, ef_return_number, "Get gravity", "Particle lifetime properties", "Gravity", "The force of gravity in pixels per second per second.");
AddExpression(14, ef_return_number, "Get angle randomiser", "Particle lifetime properties", "ParticleAngleRandom", "The maximum random angle deflection in degrees per second.");
AddExpression(15, ef_return_number, "Get speed randomiser", "Particle lifetime properties", "ParticleSpeedRandom", "The maximum random change in speed in pixels per second per second.");
AddExpression(16, ef_return_number, "Get opacity randomiser", "Particle lifetime properties", "ParticleOpacityRandom", "The maximum change in opacity per second.");
AddExpression(17, ef_return_number, "Get timeout", "Particle lifetime properties", "Timeout", "The destroy or fade to invisible timeout.");


module.exports = {};