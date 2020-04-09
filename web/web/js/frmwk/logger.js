/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * Logger.js is just a logger...
 */

core.ns('viewer.frmwk');

viewer.frmwk.Logger = ( function(){
    var enabled = true;

    function log(module, message){
        if (window.console && console.log)
            //console.log(module, message);
            console.log(String.format("[{0}] {1}", module, message));
        else {
            if (enabled) {
                alert("The console object is unavailable, and therefore logging is disabled.");
                enabled = false;
            }
        }
    }

    return {
        set: function(module) {
            return function(message) {
                if(typeof message == String) {
                    console.log(message);
//                } else if(typeof message == object) {
//                    log(module, message.toString());
                } else {
                    log( module, message);
                }
            }
        }
    }


})();