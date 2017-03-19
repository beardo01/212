/**
 * Created by Oliver Reid on 23/8/2016.
 */

/**
 * Note: We do not load all validation when the page has loaded, but rather when an edit button is pressed so that all
 * of the input fields for that row are correctly registered.
 *
 * Note on validation: Even though HTML 5 covers a lot of this validation, we still double check that values are
 * correct using JS as a form of sanity code. We take an approach of "say what the user can do and make everything
 * else invalid", rather than vice versa.
 */

var AdminValidate = (function(){
    "use strict";
    /* global Admin, XML, Global */
    var pub = {
        errors: []
    };

    /**
     * An array to hold matches, teams and venues parsed from the XML files.
     * @type {Array}
     */
    var matches = [], teams = [], venues = [];

    /**
     * This function takes the index of a match and checks to see if there is a match with the same ID in the
     * changeMatches array.
     *
     * @param otherIndex the index to check for.
     * @returns {boolean} True if the match with otherIndex is in the changeMatches array, otherwise false.
     */
    function matchIsBeingEdited(otherIndex) {
        var result = false;
        $.each(Admin.changeMatches, function(index, match) {
            if(match.index === otherIndex) {
                result = true;
            }
        });
        return result;
    }

    /**
     * This function checks to see if there are any matches that have conflicts when editing matches. It does this by
     * taking each match in the changeMatches array and checking to see if any other matches having conflicting details.
     */
    function tournamentConflicts() {
        //Reset the errors array
        pub.errors.length = 0;

        //Get the admin table
        var adminTable = $("#adminTable");

        //Reset the red rows in the admin table
        adminTable.children(":last-child").children().children().css({"borderColor" : "#464646"});

        //Check that one team isn't playing more than once on the same day.
        $.each(Admin.changeMatches, function(index, editingMatch) {
            //We want to check all the other matches that are being edited
            $.each(Admin.changeMatches, function(otherIndex, otherEditingMatch) {
                //If the match is the editingMatch, we skip it
                if(editingMatch === otherEditingMatch) {
                    return true;
                } else {
                    //If the dates are different, we skip it
                    if(editingMatch.date !== otherEditingMatch.date) {
                        return true;
                    } else {
                        //Check if the venue is different
                        if(editingMatch.venue === otherEditingMatch.venue) {
                            pub.errors.push("We've detected a clash with another match you're editing. Match " + (editingMatch.index) + " has a venue conflict with Match " + (otherEditingMatch.index) + ".");
                            $(adminTable.children(":last-child").children()[(editingMatch.index-1)]).children().css({"borderColor" : "red"});
                        }

                        //Check if the teams are different
                        if(editingMatch.name1 === otherEditingMatch.name1 || editingMatch.name1 === otherEditingMatch.name2 || editingMatch.name2 === otherEditingMatch.name1 || editingMatch.name2 === otherEditingMatch.name2) {
                            pub.errors.push("We've detected a clash with another match you're editing. Match " + (editingMatch.index) + " has a team conflict with Match " + (otherEditingMatch.index) + ".");
                            $(adminTable.children(":last-child").children()[(editingMatch.index-1)]).children().css({"borderColor" : "red"});
                        }
                    }
                }
            });

            //We want to check normal matches that aren't being edited
            $.each(matches, function(otherIndex, otherEditingMatch) {
                //We want to check to see if the index is in changeMatches array as being a match that is being edited
                if(matchIsBeingEdited(otherIndex + 1)) {
                    return true;
                } else {
                    //If the dates are different, we skip it
                    if(editingMatch.date !== otherEditingMatch.date) {
                        return true;
                    } else {
                        //Check if the venue is different
                        if(editingMatch.venue === otherEditingMatch.venue) {
                            pub.errors.push("We've detected a clash with another match. Match " + (editingMatch.index) + " has a venue conflict with Match " + (otherEditingMatch.index) + ".");
                            $(adminTable.children(":last-child").children()[(editingMatch.index-1)]).children().css({"borderColor" : "red"});
                            $(adminTable.children(":last-child").children()[(otherEditingMatch.index-1)]).children().css({"borderColor" : "red"});
                        }

                        //Check if the teams are different
                        if(editingMatch.name1 === otherEditingMatch.name1 || editingMatch.name1 === otherEditingMatch.name2 || editingMatch.name2 === otherEditingMatch.name1 || editingMatch.name2 === otherEditingMatch.name2) {
                            pub.errors.push("We've detected a clash with another match. Match " + (editingMatch.index) + " has a team conflict with Match " + (otherEditingMatch.index) + ".");
                            $(adminTable.children(":last-child").children()[(editingMatch.index-1)]).children().css({"borderColor" : "red"});
                            $(adminTable.children(":last-child").children()[(otherEditingMatch.index-1)]).children().css({"borderColor" : "red"});
                        }
                    }
                }
            });
        });
    }

    /**
     * This function handles validation on the team select box by ensuring that only teams that are in our XML file are
     * allowed to be selected. This acts as a form of sanity check in the case that someone was to try and edit HTML
     * to add more teams.
     */
    function teamValidation() {
        //Setup team
        var team = $(".team");

        //Validate the team when we select
        team.change(function() {
            var teamSelect = $(this).val();

            //Make sure that it is in the teams array
            if($.inArray(teamSelect, teams) !== -1) {
                $(this).css({"borderColor": "lime"});
                if($(this).parent().is("div")) {
                    $(this).unwrap();
                    $(this).siblings().remove();
                    Global.enableButton($("#saveAll"));
                }
            } else {
                //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
                $(this).wrap("<div class='tooltip'>");
                $(this).after("<span class='tooltipMessage'>Please select a valid team.</span>");
                $(this).css({"borderColor": "red"});
                Global.disableButton($("#saveAll"));
            }
        });
    }

    /**
     * This function handles validation of the score input number by only allowing numbers and control keys (backspace,
     * delete and the arrow keys) to be pressed and entered into this input box. Finally, we check to ensure that there
     * is a score and that it is between 0 and 100.
     */
    function scoreValidation() {
        //Setup team
        var score = $(".score");

        //Validate each keyPress in date
        score.keydown(function(event) {
            //allowedKeys are backspace, arrow keys, delete key, numbers, forward slash
            var allowedKeys = [8, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
            var controls = [8, 37, 38, 39, 40, 46];
            if($.inArray(event.keyCode, allowedKeys) !== -1) {
                if($(this).val().length < 2 || $.inArray(event.keyCode, controls) !== -1) {
                    return;
                }
            }
            event.preventDefault();
        });

        //Validate the team when we exit select
        score.focusout(function() {
            var scoreInput = $(this).val();

            //Ensure that the score is between 0 and 100 and is not empty.
            if(scoreInput < 100 && scoreInput >= 0 && scoreInput !== '') {
                $(this).css({"borderColor": "lime"});
                if($(this).parent().is("div")) {
                    $(this).unwrap();
                    $(this).siblings().remove();
                    Global.enableButton($("#saveAll"));
                }
            } else {
                //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
                $(this).wrap("<div class='tooltip'>");
                $(this).after("<span class='tooltipMessage'>Please enter a valid score between 0 and 99 (inclusive).</span>");
                $(this).css({"borderColor": "red"});
                Global.disableButton($("#saveAll"));
            }
        });
    }

    /**
     * This function handles validation of the venue by ensuring that the selected venue is in our array of venues from
     * our venue XML. This acts as a form of sanity check to ensure that no new venues have been added maliciously by
     * the user.
     */
    function venueValidation() {
        //Setup venue
        var venue = $(".venue");

        //Validate the venue when we select an option
        venue.change(function() {
            var venueSelect = $(this).val();

            if($.inArray(venueSelect, venues) !== -1) {
                $(this).css({"borderColor": "lime"});
                if($(this).parent().is("div")) {
                    $(this).unwrap();
                    $(this).siblings().remove();
                    Global.enableButton($("#saveAll"));
                }
            } else {
                //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
                $(this).wrap("<div class='tooltip'>");
                $(this).after("<span class='tooltipMessage'>Please select a valid venue.</span>");
                $(this).css({"borderColor": "red"});
                Global.disableButton($("#saveAll"));
            }
        });
    }

    /**
     * This function handles the validation of the date ensuring that the entered field meets certain criterion. Days
     * must be between 0 and 31 (inclusive), months must be between 0 and 12 (inclusive) and years must be four digits
     * and positive. Overall, users are restricted to entering only numbers and slashes and a maximum input of 10
     * characters.
     */
    function dateValidation() {
        //Setup date
        var date = $(".date");

        //Validate each keyPress in date
        date.keydown(function(event) {
            //allowedKeys are backspace, arrow keys, delete key, numbers, forward slash
            var allowedKeys = [8, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 191];
            if($.inArray(event.keyCode, allowedKeys) !== -1) {
                return;
            }
            event.preventDefault();
        });

        //Validate the date when we exit the input
        date.focusout(function() {
            var dateString = $(this).val();

            //Get parts of date
            var day = dateString.substring(0, dateString.indexOf("/"));
            var month = dateString.substring(dateString.indexOf("/") + 1, dateString.indexOf("/", dateString.indexOf("/") + 1));
            var year = dateString.substring(dateString.indexOf("/", dateString.indexOf("/") + 1) + 1);

            //Check that the date is valid
            if(day < 32 && day > 0 && month < 13 && month > 0 && year > 0 && year.length === 4 && dateString.length > 7 && dateString.length < 11) {
                //It is, set the border color lime for success and remove the tooltip if it exists
                $(this).css({"borderColor": "lime"});
                if($(this).parent().is("div")) {
                    $(this).unwrap();
                    $(this).siblings().remove();
                    Global.enableButton($("#saveAll"));
                }
            } else {
                //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
                $(this).wrap("<div class='tooltip'>");
                $(this).after("<span class='tooltipMessage'>Please enter a valid date in DD/MM/YYYY format.</span>");
                $(this).css({"borderColor": "red"});
                Global.disableButton($("#saveAll"));
            }
        });
    }

    /**
     * This function takes data read in from XML and stores it in the array specified by the store parameter for use by
     * other functions.
     *
     * @param data the data from the XML file.
     * @param store the array in which to store the data.
     */
    function storeData(data, store) {
        if(store === "teams") {
            $(data).find("match").each(function(index) {
                var Match = {
                    index: index + 1,
                    name1: $(this).find("team")[0].textContent,
                    name2: $(this).find("team")[1].textContent,
                    score1: $(this).find("team").eq(0).attr("score") !== undefined ? $(this).find("team").eq(0).attr("score") : "-",
                    score2: $(this).find("team").eq(0).attr("score") !== undefined ? $(this).find("team").eq(0).attr("score") : "-",
                    venue: $(this).find("venue")[0].textContent,
                    date: $(this).find("day")[0].textContent + "/" + $(this).find("month")[0].textContent + "/" + $(this).find("year")[0].textContent
                };

                matches.push(Match);

                if($.inArray(Match.name1, teams) === -1) {
                    teams.push(Match.name1);
                }

                if($.inArray(Match.name2, teams) === -1) {
                    teams.push(Match.name2);
                }
            });
        } else if (store === "venues") {
            $.each($(data).find("venues").children(), function(index, venue) {
                if($.inArray(venue, venues) === -1) {
                    venues.push(venue.textContent);
                }
            });
        }
    }

    /**
     * This public function acts as a setup for input validation.
     */
    pub.input = function () {
        //Setup all of the input fields with their validation
        teamValidation();
        scoreValidation();
        venueValidation();
        dateValidation();
    };

    /**
     * This public function acts as a setup for tournament validation.
     */
    pub.tournament = function () {
        tournamentConflicts();
    };

    /**
     * This function sets up the file by reading in XML for sanity checks used in other functions.
     */
    pub.setup = function() {
        //Make the jQuery GET request to get the tournament data
        $.ajax({
            type: "GET",
            url: XML.tournamentXML,
            cache: false,
            success: function (data) {
                //Call the storeData function to begin parsing the tournament data
                storeData(data, "teams");
            }
        });

        //Make the jQuery GET request to get the tournament data
        $.ajax({
            type: "GET",
            url: XML.venuesXML,
            cache: false,
            success: function (data) {
                //Call the storeData function to begin parsing the venues data
                storeData(data, "venues");
            }
        });
    };

    return pub;
}());

//Load the AdminValidate.setup function when the page has loaded
$(document).ready(AdminValidate.setup);