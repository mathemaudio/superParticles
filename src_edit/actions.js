/**
 * Created by Shalmu Y. on 12.4.16.
 */
"use strict";


// read about parameter types in a file "parameterTypes.js"

// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddComboParamOption("not spraying");
AddComboParamOption("spraying");
AddComboParam("State", "Whether or not the spray is currently enabled.");
AddAction(0, af_none, "Set spraying", "Particle spray", "Set {0}", "Enable or disable the continuous spray.", "SetSpraying");

AddNumberParam("Rate", "Number of particles to create per second.");
AddAction(1, af_none, "Set rate", "Particle spray", "Set rate to {0}", "Set the number of particles created per second.", "SetRate");

AddNumberParam("Spray cone", "Number of degrees through which particles are created.");
AddAction(2, af_none, "Set spray cone", "Particle spray", "Set spray cone to {0} degrees", "Set the number of degrees through which particles are created.", "SetSprayCone");

AddComboParamOption("Normal");
AddComboParamOption("Additive");
AddComboParamOption("XOR");
AddComboParamOption("Copy");
AddComboParamOption("Destination over");
AddComboParamOption("Source in");
AddComboParamOption("Destination in");
AddComboParamOption("Source out");
AddComboParamOption("Destination out");
AddComboParamOption("Source atop");
AddComboParamOption("Destination atop");
AddComboParam("Blend mode", "Choose the new blend mode for this object.");
AddAction(3, 0, "Set blend mode", "Appearance", "Set blend mode to <i>{0}</i>", "Set the background blend mode for this object.", "SetEffect");

AddNumberParam("Speed", "Initial particle speed, in pixels per second.");
AddAction(4, af_none, "Set speed", "Initial particle properties", "Set initial particle speed to {0}", "Set the initial particle speed.", "SetInitSpeed");

AddNumberParam("Size", "Initial size of each particle, in pixels.");
AddAction(5, af_none, "Set size", "Initial particle properties", "Set initial particle size to {0}", "Set the initial size of each particle.", "SetInitSize");

AddNumberParam("Opacity", "Initial opacity of each particle, from 0 (transparent) to 100 (opaque).");
AddAction(6, af_none, "Set opacity", "Initial particle properties", "Set initial particle opacity to {0}", "Set the initial particle opacity.", "SetInitOpacity");

AddNumberParam("Grow rate", "Rate the size changes over time, in pixels per second.");
AddAction(7, af_none, "Set grow rate", "Initial particle properties", "Set grow rate to {0}", "Set the initial particle grow rate.", "SetGrowRate");

AddNumberParam("X randomiser", "Random X co-ordinate offset on creation.");
AddAction(8, af_none, "Set X randomiser", "Initial particle properties", "Set initial particle X randomiser to {0}", "Set the initial particle X randomiser.", "SetXRandomiser");

AddNumberParam("Y randomiser", "Random Y co-ordinate offset on creation.");
AddAction(9, af_none, "Set Y randomiser", "Initial particle properties", "Set initial particle Y randomiser to {0}", "Set the initial particle Y randomiser.", "SetYRandomiser");

AddNumberParam("Speed randomiser", "Random addition to particle speed on creation.");
AddAction(10, af_none, "Set speed randomiser", "Initial particle properties", "Set initial particle speed randomiser to {0}", "Set the random addition to particle speed on creation.", "SetSpeedRandomiser");

AddNumberParam("Size randomiser", "Random addition to particle size on creation.");
AddAction(11, af_none, "Set size randomiser", "Initial particle properties", "Set initial particle size randomiser to {0}", "Set the random addition to particle size on creation.", "SetSizeRandomiser");

AddNumberParam("Grow rate randomiser", "Random addition to particle grow rate on creation.");
AddAction(12, af_none, "Set grow rate randomiser", "Initial particle properties", "Set initial particle grow rate randomiser to {0}", "Set the random addition to particle grow rate on creation.", "SetGrowRateRandomiser");

AddNumberParam("Acceleration", "Particle acceleration, in pixels per second per second.");
AddAction(13, af_none, "Set acceleration", "Particle lifetime properties", "Set particle acceleration to {0}", "Set the particle acceleration.", "SetParticleAcc");

AddNumberParam("Gravity", "Force of gravity, in pixels per second per second.");
AddAction(14, af_none, "Set gravity", "Particle lifetime properties", "Set particle gravity to {0}", "Set the force of gravity.", "SetGravity");

AddNumberParam("Angle randomiser", "Maximum random angle deflection in degrees per second.");
AddAction(15, af_none, "Set angle randomiser", "Particle lifetime properties", "Set particle angle randomiser to {0}", "Set the maximum random angle deflection per second.", "SetAngleRandomiser");

AddNumberParam("Speed randomiser", "Maximum random speed adjustment per second, in pixels per second per second.");
AddAction(16, af_none, "Set speed randomiser", "Particle lifetime properties", "Set particle speed randomiser to {0}", "Set the maximum random speed adjustment per second.", "SetLifeSpeedRandomiser");

AddNumberParam("Opacity randomiser", "Maximum random opacity adjustment per second.");
AddAction(17, af_none, "Set opacity randomiser", "Particle lifetime properties", "Set particle opacity randomiser to {0}", "Set the maximum random opacity adjustment per second.", "SetOpacityRandomiser");

AddNumberParam("Timeout", "Time in seconds for timeout or fade to invisible (depending on destroy mode).");
AddAction(18, af_none, "Set timeout", "Particle lifetime properties", "Set particle timeout to {0}", "Set the destroy timeout or fade to invisible time.", "SetTimeout");

 AddObjectParam("Map", 'The map should have a WHITE background, where BLACK areas will be used for emission');
AddAction(19, af_none, "Set emit map", "Map properties", "Set emission map to {0}", "Set the emission map.", "SetEmissionMap");



module.exports = {};
