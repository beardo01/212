/**
 * Created by Oliver Reid on 26/8/2016.
 */

var XML = (function(){
    "use strict";
    /* global tournamentXML */
    return {
        /**
         * We define a global variable to our tournament.xml file.
         *
         * @type {string} representing the path to the tournament xml file.
         */
        tournamentXML: "xml/tournament2.xml",

        /**
         * We define a global variable to our venues.xml file.
         *
         * @type {string} representing the path to the venues xml file.
         */
        venuesXML: "xml/venues2.xml"
    };
}());

//Load the XML class when the page has loaded
$(document).ready(XML);