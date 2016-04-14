/* @flow */
/**
 * Created by Shalmu Y. on 12.4.16.
 */



////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

/**
 * IMPORTANT: yes, this variable below should be implicitly declared to make sure it is GLOBAL
 * @type {Array}
 */
property_list = [
  // Properties
  new cr.Property(ept_float, "Rate", 50, "Number of particles to create per second, or total for one-shot."),
  new cr.Property(ept_float, "Spray cone", 60, "Number of degrees through which particles are created."),
  new cr.Property(ept_combo, "Type", "Continuous spray", "Either a spray or a one-shot blast of particles.", "Continuous spray|One-shot"),
  new cr.Property(ept_link, "Image", lang("project\\misc\\particles-edit-link"), "Click to edit the particle image.", "firstonly"),
  //new cr.Property(ept_combo,	"Effect",		"(none)",			"Choose an effect for this object.  (This does not preview in the layout, only when you run.)", "(none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop"),

  // Creation settings
  new cr.Property(ept_section, "Initial particle properties", "", "Properties affecting the creation of each particle."),
  new cr.Property(ept_float, "Speed", 200, "Initial particle speed, in pixels per second."),
  new cr.Property(ept_float, "Size", 32, "Initial size of each particle, in pixels."),
  new cr.Property(ept_float, "Opacity", 100, "Initial opacity of each particle, from 0 (transparent) to 100 (opaque)."),
  new cr.Property(ept_float, "Grow rate", 0, "Rate the size changes over time, in pixels per second."),
  new cr.Property(ept_float, "X randomiser", 0, "Random X co-ordinate offset on creation."),
  new cr.Property(ept_float, "Y randomiser", 0, "Random Y co-ordinate offset on creation."),
  new cr.Property(ept_float, "Speed randomiser ", 0, "Random addition to particle speed on creation."),
  new cr.Property(ept_float, "Size randomiser", 0, "Random addition to particle size on creation."),
  new cr.Property(ept_float, "Grow rate randomiser", 0, "Random addition to particle grow rate on creation."),

  // Particle lifetime settings
  new cr.Property(ept_section, "Particle lifetime properties", "", "Properties affecting the behavior of each particle."),
  new cr.Property(ept_float, "Acceleration", -150, "Acceleration of each particle, in pixels per second per second."),
  new cr.Property(ept_float, "Gravity", 0, "Force of gravity, in pixels per second per second."),
  new cr.Property(ept_float, "Angle randomiser", 0, "Maximum random angle deflection in degrees per second."),
  new cr.Property(ept_float, "Speed randomiser", 800, "Maximum random speed adjustment per second, in pixels per second per second."),
  new cr.Property(ept_float, "Opacity randomiser", 0, "Maximum random opacity adjustment per second."),
  new cr.Property(ept_combo, "Destroy mode", "Fade to invisible", "Choose when each individual particle is destroyed.", "Fade to invisible|Timeout expired|Particle stopped"),
  new cr.Property(ept_float, "Timeout", 1, "Time in seconds for timeout or fade to invisible (depending on destroy mode)."),

  // Particle spin/spin
  new cr.Property(ept_section, "Rotation properties", "", "Properties affecting the spin/spin."),
  new cr.Property(ept_float, "Init spin", 0, "How it's going to be rotated initially, in degrees"),
  new cr.Property(ept_float, "Init spin randomiser", 30, "Maximum initial random spin in degrees"),
  new cr.Property(ept_float, "Spin speed", 0, "The speed of each particle's spin"),
  new cr.Property(ept_float, "Spin speed randomizer", 0, "Randomization of each spin speed"),
  new cr.Property(ept_float, "Spin acceleration multipier", 1, 'The acceleraton of the spin, 1 is "no acceleration" value less than 1 slows it down, value bigger than 1 speeds it up.'),
  new cr.Property(ept_float, "Spin acceleration rand", 0, "Randomization of each particle's spin acceleraton"),


  // intro features
  new cr.Property(ept_section, "Intro properties", "", ""),
  new cr.Property(ept_float, "Fade in", 0.2, '"Fade in" time, in seconds'),
  new cr.Property(ept_float, "Fade in randomizer", 0.2, '"Fade in" randomizaton, in seconds'),
  new cr.Property(ept_float, "Scale in", 0.1, '"Scale in" time, in seconds'),
  new cr.Property(ept_float, "Scale randomizer", 0.3, '"Scale in" randomizaton, in seconds'),
];

module.exports = property_list;