/** IMPORTANT: yes, this variable below should be implicitly declared to make sure it is GLOBAL */

require('./settings');

// Called by IDE when a new object type is to be created
/** IMPORTANT: yes, this variable below should be implicitly declared to make sure it is GLOBAL */
CreateIDEObjectType = function() {  return new IDEObjectType();  };

require('./conditions');
require('./actions');
require('./expressions');
ACESDone();


var IDEInstance = require('./IDEInstance');

// Class representing an object type in the IDE
/**
 * @constructor
 */
function IDEObjectType() {
  this.CreateInstance = function (instance) {
    return new IDEInstance(instance);
  };
}


