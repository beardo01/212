/**
 * Created by oreid on 8/23/16.
 */
var Fixtures = (function(){
    "use strict";
    /* global XML */
    var pub = {};
    var gamesPlayed = [], gamesToPlay = [];

    /**
     * This method takes input from a XML file and parses it to create matches in our tournament.
     *
     * @param data the information taken from the XML file.
     */
    function parseTournament(data) {
        //Get our table body so we can add rows to them
        var playedTable = $("#played").find("tbody")[0];
        var toPlayTable = $("#toplay").find("tbody")[0];

        //Go though each match and check the details
        $(data).find("match").each(function() {
            //Get the details from the match
            var Match = {
                name1: $(this).find("team")[0].textContent,
                name2: $(this).find("team")[1].textContent,
                score1: $(this).find("team").eq(0).attr("score"),
                score2: $(this).find("team").eq(1).attr("score"),
                venue: $(this).find("venue")[0].textContent,
                date: $(this).find("day")[0].textContent + "/" + $(this).find("month")[0].textContent + "/" + $(this).find("year")[0].textContent
            };

            //Add the match to the appropriate array depending on whether the match has been played or not
            if(Match.score1 !== undefined && Match.score2 !== undefined) {
                gamesPlayed.push(Match);
            } else {
                gamesToPlay.push(Match);
            }
        });

        //Remove the first row from each table (added for validation)
        $(playedTable).children(":first-child").remove();
        $(toPlayTable).children(":first-child").remove();

        //Check to see if any games have been played
        if(gamesPlayed.length > 0) {
            //Add the teams to the results table
            $.each(gamesPlayed, function (index, match) {
                //Add the played matches to the played matches table
                $(playedTable).append("<tr>" +
                    "<td>" + match.name1 + "</td>" +
                    "<td>" + match.score1 + "</td>" +
                    "<td>" + match.score2 + "</td>" +
                    "<td>" + match.name2 + "</td>" +
                    "<td>" + match.venue + "</td>" +
                    "<td>" + match.date + "</td>" +
                    "</tr>");
            });
        } else {
            //No games have been played, let users know that no games have been played.
            $(playedTable).append("<tr><td colspan='6' class='tLeft'>No games have been played this season.</td></tr>");
        }

        //Check to see if any games have been played
        if(gamesToPlay.length > 0) {
            //Some games have been played, add the teams to the results table
            $.each(gamesToPlay, function (index, match) {
                //Add the played matches to the played matches table
                $(toPlayTable).append("<tr>" +
                    "<td>" + match.name1 + "</td>" +
                    "<td> - </td>" +
                    "<td> - </td>" +
                    "<td>" + match.name2 + "</td>" +
                    "<td>" + (match.venue === '' ? '-' : match.venue) + "</td>" +
                    "<td>" + (match.date === '//' ? '-' : match.date) + "</td>" +
                    "</tr>");
            });
        } else {
            //All games have been played, let users know that all games have been played.
            $(toPlayTable).append("<tr><td colspan='6' class='tLeft'>All games have been played this season.</td></tr>");
        }
    }

    /**
     * This public function acts as a setup for our JS file and is called when the document has loaded.
     */
    pub.setup = function () {
        //Make the jQuery GET request to get the tournament data
        $.ajax({
            type: "GET",
            url: XML.tournamentXML,
            cache: false,
            success: function (data) {
                //Call the parseTournament function to begin parsing the tournament data
                parseTournament(data);
            }
        });
    };

    return pub;
}());

//Load the Fixtures.setup function when the page has loaded
$(document).ready(Fixtures.setup);