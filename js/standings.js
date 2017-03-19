/**
 * Created by Oliver Reid on 22/8/2016.
 */

var Standings = (function(){
    "use strict";
    /* global XML */
    var pub = {};
    var teams = [];

    /**
     * This method searches the array of teams and returns the team object which has the name passed as a parameter.
     *
     * @param name the name of the team to get from the teams array.
     * @returns {*} a team object representing the team which has the name given as a parameter.
     */
    function getTeam(name) {
        var i;

        for(i = 0; i < teams.length; i++) {
            if(name === teams[i].name) {
                return teams[i];
            }
        }
    }

    /**
     * This method checks to see if a team given by its name exists in the teams array.
     *
     * @param name the name of the team to search for.
     * @returns {boolean} representing whether the team was in the team array or not.
     */
    function containsTeam(name) {
        var i;

        for(i = 0; i < teams.length; i++) {
            if(name === teams[i].name) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method takes a team and two scores as parameters and updates the passed team accordingly.
     *
     * @param team the team to update.
     * @param score1 the score that the team got.
     * @param score2 the score that the team that the team was playing got.
     */
    function updateTeam(team, score1, score2) {
        //Update games played
        team.played += 1;

        //Update wins, losses and draws
        if (score1 > score2) {
            team.won += 1;
        } else if (score1 < score2) {
            team.lost += 1;
        } else {
            team.drawn += 1;
        }

        //Update the goals for and against
        team.gfor += parseInt(score1);
        team.gagainst += parseInt(score2);
    }

    /**
     * This constructor creates a new team object.
     *
     * @param name the name of the the team to create.
     * @constructor
     */
    function Team(name) {
        this.name = name;
        this.played = 0;
        this.won = 0;
        this.drawn = 0;
        this.lost = 0;
        this.gfor = 0;
        this.gagainst = 0;
        this.diff = 0;
        this.points = 0;
    }

    /**
     * This method takes input from a XML file and parses it to create teams in our tournament.
     *
     * @param data the information taken from the XML file.
     */
    function parseTournament(data) {
        //Get our table body to add rows to it
        var tableBody = $("#standings").find("tbody")[0];

        //Go though each match and check the details
        $(data).find("match").each(function() {
            //Get the details from the match
            var name1 = $(this).find("team")[0].textContent;
            var name2 = $(this).find("team")[1].textContent;
            var score1 = $(this).find("team").eq(0).attr("score");
            var score2 = $(this).find("team").eq(1).attr("score");

            //Check if we already have team1, if not create it and add it to our array
            if(!containsTeam(name1)) {
                teams.push(new Team(name1));
            }

            //Check if we already have team2, if not create it and add it to our array
            if(!containsTeam(name2)) {
                teams.push(new Team(name2));
            }

            //Check if the match has been played (there is a score) and update both teams details
            if(score1 !== undefined && score2 !== undefined) {
                updateTeam(getTeam(name1), score1, score2);
                updateTeam(getTeam(name2), score2, score1);
            }

        });

        //Work out the points for each team
        $.each(teams, function(index, team) {
            team.diff = team.gfor - team.gagainst;
            team.points = (2 * team.won) + team.drawn;
        });

        //Sort the teams by points (then difference) in descending order
        teams.sort(function(team1, team2) {
            //Sort first by points
            if(team1.points > team2.points) {
                return -1;
            }
            if(team1.points < team2.points) {
                return 1;
            }

            //If points are equal, sort by difference
            if(team1.diff > team2.diff){
                return -1;
            }
            if(team1.diff < team2.diff) {
                return 1;
            }

            //If everything is still equal, return no difference
            return 0;
        });

        //Add the teams to the results table
        $.each(teams, function(index, team) {
            //Add a plus sign to positive differences
            if(team.diff > 0) {
                team.diff = "+" + team.diff;
            }

            //Add the teams to the results table
            $(tableBody).append("<tr>" +
                "<td>" + (index+1) + "</td>" +
                "<td>" + team.name + "</td>" +
                "<td>" + team.played + "</td>" +
                "<td>" + team.won + "</td>" +
                "<td>" + team.drawn + "</td>" +
                "<td>" + team.lost + "</td>" +
                "<td>" + team.gfor+ "</td>" +
                "<td>" + team.gagainst + "</td>" +
                "<td>" + team.diff + "</td>" +
                "<td>" + team.points + "</td>" +
                "</tr>");
        });
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

//Load the Standings.setup function when the page has loaded
$(document).ready(Standings.setup);