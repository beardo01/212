/**
 * Created by Oliver Reid on 23/8/2016.
 */
var Admin = (function(){
    "use strict";
    /* global AdminValidate, XML, Global */
    var pub = {
        changeMatches: []
    };
    var matches = [], editing = 0, venues = [], teams = [];

    /**
     * This function checks to see if the match is already in the changeMatches array.
     *
     * @param index the index of the match in the table to check for.
     * @returns {boolean} boolean representing whether or not the match is in the array.
     */
    function containsMatch(index) {
        var i;
        for(i = 0; i < pub.changeMatches.length; i++) {
            if(index === pub.changeMatches[i].index) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method checks to see if a team given by its name exists in the teams array.
     *
     * @param name the name of the team to search for.
     * @returns {boolean} boolean representing whether the team was in the team array or not.
     */
    function containsTeam(name) {
        var i;

        for(i = 0; i < teams.length; i++) {
            if(name === teams[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * This function takes a match to edit in the changeMatches array and updates its contents with the new details.
     *
     * @param editedMatch the match to be edited.
     */
    function updateEdit(editedMatch) {
        //We search through each match in the array and edit the one that has the same index as ours.
        $.each(pub.changeMatches, function(index, match) {
            if(match.index === editedMatch.index) {
                match.name1 = editedMatch.name1;
                match.score1 = editedMatch.score1;
                match.score2 = editedMatch.score2;
                match.name2 = editedMatch.name2;
                match.venue = editedMatch.venue;
                match.date = editedMatch.date;
            }
        });
    }

    /**
     * This function takes XML data as a parameter and stores the venues from the XML file in the venues array.
     *
     * @param data the data from the XML file to be parsed to the venues array.
     */
    function venueStore(data) {
        //We store each venues in the venues array.
        $.each($(data).find("venues").children(), function(index, venue) {
            venues.push(venue.textContent);
        });
    }

    /**
     * This function takes a value to set as selected, a set of data and an optional parameter to exclude from the
     * select and creates a select box.
     *
     * @param selected the option to set as selected in the select box.
     * @param data the array that the select box should be made from.
     * @param sClass the class to set the select as.
     * @param name the name to set as the selects name.
     * @param exclude the option to exclude from the select.
     * @returns {string} a select box in string format.
     */
    function selectCreate(selected, data, sClass, name, exclude) {
        //Deal with the optional "exclude" variable
        if(typeof exclude === 'undefined') { exclude = 'default'; }

        //Append the start of the select to the variable
        var selectElement = "<select class='" + sClass + "' name='" + name + "'>";

        //Append each venue to the select except for the exclude value
        $.each(data, function(index, value) {
            if(value === exclude) {
                return true;
            } else {
                if(selected === value) {
                    selectElement += "<option selected value='" + value + "'>" + value + "</option>";
                } else {
                    selectElement += "<option value='" + value + "'>" + value + "</option>";
                }
            }
        });

        //Append the end of the select
        selectElement += "</select>";

        //Return the selectElement
        return selectElement;
    }

    /**
     * This function updates an existing select box accepting a select box, an item to be selected, the data to create
     * the select box from and the option to remove.
     *
     * @param selectElement the select box to update.
     * @param selected the option to set as selected.
     * @param data the array that the select box should be made from.
     * @param remove the option to remove.
     */
    function selectUpdate(selectElement, selected, data, remove) {
        //Remove all options from the select
        $(selectElement).children().empty();

        $.each(data, function(index, value) {
            if(value === remove) {
                return true;
            } else {
                if(selected === value) {
                    $($(selectElement).children()[0]).append("<option selected value='" + value + "'>" + value + "</option>");
                } else {
                    $($(selectElement).children()[0]).append("<option value='" + value + "'>" + value + "</option>");
                }
            }
        });
    }

    /**
     * This function is called when the "Save All" button is clicked and spawns a modal with a series of tables showing
     * for every match to be edited, what its previous data was and what the new data will be.
     *
     * @param draw this tells the modal whether or not it should draw itself, depending on if we are updating data or
     * want to view the modal.
     */
    function saveMatches(draw) {
        //Reset the changeMatches array
        pub.changeMatches.length = 0;

        //Get all of the matches that we want to change and add them to changeMatches array
        $("#adminTable").find("tr").each(function(index, row) {
            //Check if the match is already in the edited match array
            if($(row).children(":last-child").find("input").attr("value") === "Cancel") {
                //Get rows details
                var editedMatch = {
                    index: index,
                    name1: $($($(row).children()[1]).children()[0]).val(),
                    score1: $($($(row).children()[2]).children()[0]).val(),
                    score2: $($($(row).children()[3]).children()[0]).val(),
                    name2: $($($(row).children()[4]).children()[0]).val(),
                    venue: $($($(row).children()[5]).children()[0]).val(),
                    date: $($($(row).children()[6]).children()[0]).val()
                };

                //We check to see if the changeMatches already contains the editedMatch object, if not we add it otherwise we update it
                if(!containsMatch(index)) {
                    pub.changeMatches.push(editedMatch);
                } else {
                    updateEdit(editedMatch);
                }
            }
        });

        //Do our logic validation
        AdminValidate.tournament();

        //Create the changes table
        var confirmationContent = $("#confirmationBody");
        confirmationContent.html("");

        //Create the edit match tables
        $.each(pub.changeMatches, function(index, match) {
            confirmationContent.append("<h3>Match " + (match.index) + "</h3><table id='changesTable' class='borderTable'><thead><tr><th scope='col'></th><th scope='col'>Old Match</th><th scope='col'>New Match</th></tr></thead><tbody>" +
                "<tr><th scope='row'>Team 1</th><td>" + matches[match.index-1].name1  + "</td><td>" + match.name1 +"</td></tr>" +
                "<tr><th scope='row'>Team 1 Score</th><td>" + matches[match.index-1].score1  + "</td><td>" + (match.score1 === "" ? "-" : match.score1) +"</td></tr>" +
                "<tr><th scope='row'>Team 2</th><td>" + matches[match.index-1].name2  + "</td><td>" + match.name2 +"</td></tr>" +
                "<tr><th scope='row'>Team 2 Score</th><td>" + matches[match.index-1].score2  + "</td><td>" + (match.score2 === "" ? "-" : match.score2) +"</td></tr>" +
                "<tr><th scope='row'>Venue</th><td>" + matches[match.index-1].venue  + "</td><td>" + match.venue +"</td></tr>" +
                "<tr><th scope='row'>Date</th><td>" + (matches[match.index-1].date === '//' ? '' : matches[match.index-1].date)  + "</td><td>" + match.date +"</td></tr>" +
                "</tbody></table>");
        });

        if(draw) {
            //Get reference to the confirm button
            var confirmButton = $("#confirmationConfirm");

            //Add errors if any
            if(AdminValidate.errors.length > 0) {
                var errorList = "<ul>";
                $.each(AdminValidate.errors, function(index, error) {
                    errorList += "<li>" + error + "</li>";
                });
                errorList += "</ul><p>You need to go back and remove these conflicts to proceed.</p>";

                confirmationContent.append("<h3>Errors</h3>" + errorList);

                Global.disableButton(confirmButton);
            }

            //Get a reference to our modal
            var confirmationModal = $("#confirmationModal");

            //Check if we need to make the modal content scrollable or revert it back
            if(pub.changeMatches.length > 2) {
                confirmationContent.css({"overflowY": "scroll"});
                confirmationContent.css({"height": "424px"});
            } else {
                confirmationContent.css({"overflowY": "auto"});
                confirmationContent.css({"height": ""});
            }

            //Animate the modal to appear
            confirmationModal.css({"display": "block"});
            confirmationModal.animate({"top": "0", "opacity": "1"});

            //Create the close button click event
            $("#confirmationClose").click(function() {
                confirmationModal.css({"display": "none"});
                confirmationModal.animate({"top": "-200", "opacity": "0"});
                Global.enableButton($("#confirmationConfirm"));
            });
        }
    }

    /**
     * This function takes a row and a reference to the calling button to revert a row back to its original state when
     * the cancel button is selected.
     *
     * @param row the row data to revert to.
     * @param reference the button representing what row to revert.
     */
    function cancelEdit(row, reference) {
        //Set the editable fields back to the original data
        $(reference).parent().parent().html(row);

        //Recall the tournament validation
        saveMatches(false);

        //Re-register the click listener and turn the other one off
        $(".editMatch").off('click').click(editMatch);

        //Decrement editing as we are editing one less row
        editing--;

        //Check to see if we are no longer editing any rows, if not, remove the saveAll button
        if(editing === 0) {
            $("#adminTable").children().last().children().last().remove();
        }

        //Check to see if we should re-enable the saveAll button
        if($(".tooltip").length === 0) {
            Global.enableButton($("#saveAll"));
        }
    }

    /**
     * This function handles the edit match part of the admin page. It provides a handler for when an edit button is
     * pressed.
     */
    function editMatch() {
        //Get the current data I also disable the JSHint this warning as I am sure that it is a valid use.
        /* jshint -W040 */
        var team1 = $(this).parent().siblings()[1];
        var score1 = $(this).parent().siblings()[2];
        var score2 = $(this).parent().siblings()[3];
        var team2 = $(this).parent().siblings()[4];
        var venue = $(this).parent().siblings()[5];
        var date = $(this).parent().siblings()[6];

        //Take a deep copy of the row so we can revert changes
        var row = $(this).parent().parent().html();

        //Append save all row and handle events for it
        if(editing === 0) {
            //Append the row
            $(this).parent().parent().parent().append("<tr>" +
                "<td colspan='7'></td>" +
                "<td> <input type='button' value='Save All' id='saveAll'> </td>" +
                "</tr>");

            //Add a click event for saveAll button and ensure that no other click events are registered
            $("#saveAll").off("click").click(saveMatches);
        }

        //Increment editing as we are editing one more row
        editing++;

        //Change the edit button to cancel
        $(this).parent().find("input").attr("value", "Cancel");
        $(this).parent().find("input").attr("class", "cancelEdit");

        //Register the edit click event to the edit button and turn any other event off
        $(this).off('click').click(function() {
            cancelEdit(row, this);
        });

        /* jshint +W040 */

        //Get the match ID for use in name
        var matchID = $(this).parent().siblings()[0];

        //Create the team selects
        var team1Select = selectCreate(team1.textContent, teams, "team", "match[" + matchID.textContent + "][team1]", team2.textContent);
        var team2Select = selectCreate(team2.textContent, teams, "team", "match[" + matchID.textContent + "][team2]", team1.textContent);

        //Set the current table cells to editable ones
        $(matchID).html(matchID.textContent + "<input type='hidden' value='" + matchID.textContent + "' name='match[" + matchID.textContent + "][matchID]'><input type='hidden' value='1' name='match[" + matchID.textContent + "][editing]'>");
        $(team1).html(team1Select);
        $(score1).html("<input type='number' value='" + score1.textContent + "' class='score' name='match[" + matchID.textContent + "][score1]' min='0' max='99'>");
        $(score2).html("<input type='number' value='" + score2.textContent + "' class='score' name='match[" + matchID.textContent + "][score2]' min='0' max='99'>");
        $(team2).html(team2Select);
        $(venue).html(selectCreate(venue.textContent, venues, "venue", "match[" + matchID.textContent + "][venue]"));
        $(date).html("<input type='text' value='" + date.textContent + "' class='date' name='match[" + matchID.textContent + "][date]' maxlength='10'>");

        //Register the team select box events
        $($(team1).children()[0]).on('change', function() {
            selectUpdate(team2, $($(team2).children()[0]).val(), teams, $($(team1).children()[0]).val());
        });

        $($(team2).children()[0]).on('change', function() {
            selectUpdate(team1, $($(team1).children()[0]).val(), teams, $($(team2).children()[0]).val());
        });

        //Re-register validation
        AdminValidate.input();
    }

    /**
     * This function takes input from a XML file and parses it to create matches in our tournament.
     *
     * @param data the information taken from the XML file.
     */
    function parseTournament(data) {
        //Get our table body so we can add rows to them
        var matchesTable = $("#adminTable").find("tbody")[0];

        //Go though each match and check the details
        $(data).find("match").each(function() {
            //Get the details from the match
            var Match = {
                name1: $(this).find("team")[0].textContent,
                name2: $(this).find("team")[1].textContent,
                score1: $(this).find("team").eq(0).attr("score") !== undefined ? $(this).find("team").eq(0).attr("score") : "-",
                score2: $(this).find("team").eq(1).attr("score") !== undefined ? $(this).find("team").eq(1).attr("score") : "-",
                venue: $(this).find("venue")[0].textContent,
                date: $(this).find("day")[0].textContent + "/" + $(this).find("month")[0].textContent + "/" + $(this).find("year")[0].textContent
            };

            //Add the match to the matches array
            matches.push(Match);

            //Add the team to the teams array
            if(!containsTeam(Match.name1)) {
                teams.push(Match.name1);
            }

            if(!containsTeam(Match.name2)) {
                teams.push(Match.name2);
            }
        });

        //Remove the row that is automatically put there (for validation)
        $(matchesTable).children(":first-child").remove();

        //Check to see if any games have been played
        if(matches.length > 0) {
            //Add the teams to the results table
            $.each(matches, function (index, match) {
                //Add the played matches to the played matches table
                $(matchesTable).append("<tr>" +
                    "<td>" + (index + 1) + "<input type='hidden' value='" + (index + 1) + "' name='match[" + (index + 1) + "][matchID]'><input type='hidden' value='0' name='match[" + (index + 1) + "][editing]'></td>" +
                    "<td>" + match.name1 + "<input type='hidden' value='" + match.name1 + "' name='match[" + (index + 1) + "][team1]'></td>" +
                    "<td class='scoreTable'>" + match.score1 + "<input type='hidden' value='" + match.score1 + "' name='match[" + (index + 1) + "][score1]'></td>" +
                    "<td class='scoreTable'>" + match.score2 + "<input type='hidden' value='" + match.score2 + "' name='match[" + (index + 1) + "][score2]'></td>" +
                    "<td>" + match.name2 + "<input type='hidden' value='" + match.name2 + "' name='match[" + (index + 1) + "][team2]'></td>" +
                    "<td>" + match.venue + "<input type='hidden' value='" + match.venue + "' name='match[" + (index + 1) + "][venue]'></td>" +
                    "<td>" + (match.date === '//' ? '' : match.date) + "<input type='hidden' value='" + match.date + "' name='match[" + (index + 1) + "][date]'></td>" +
                    "<td> <input type='button' value='Edit' class='editMatch'> " +
                    "</tr>");
            });
        } else {
            //No games have been played, let users know that no games have been played.
            $(matchesTable).append("<tr><td colspan='6' class='tLeft'>There are not matches played or planned for this season.</td></tr>");
        }

        //Register the edit click event to the edit button
        $(".editMatch").click(editMatch);
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

        //Make the jQuery GET request to get the tournament data
        $.ajax({
            type: "GET",
            url: XML.venuesXML,
            cache: false,
            success: function (data) {
                //Call the venueSelect function to begin parsing the tournament data
                venueStore(data);
            }
        });
    };

    return pub;
}());

//Load the Admin.setup function when the page has loaded
$(document).ready(Admin.setup);