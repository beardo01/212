/**
 * Created by Oliver Reid on 26/8/2016.
 */
var Global = (function(){
    "use strict";
    var pub = {};

    /**
     * This function takes a button as a parameter and enables it for input.
     *
     * @param button the button to enable.
     */
    pub.enableButton = function(button) {
        button.prop("disabled", false);
        button.css({"color": "black"});
    };

    /**
     * This function takes a button as a parameter and disables it from input.
     *
     * @param button the button to disable.
     */
    pub.disableButton = function(button) {
        button.prop("disabled", true);
        button.css({"color": "lightgrey"});
    };

    return pub;
}());

//Load the Global function when the page has loaded
$(document).ready(Global);