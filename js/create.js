/**
 * Created by oreid on 10/6/16.
 */
var Create = (function(){
    "use strict";
    /* global XML */
    var pub = {};
    var venues = [], teams = [];

    /**
     * Runs the venues and teams against basic validation and then creates a error or confirmation modal accordingly.
     */
    function validate() {
        var errors = [];

        //Check that we have one venue
        if(venues.length < 1) {
            errors.push("A tournament must contain at least one venue.");
        }

        //Check that we have two teams
        if(teams.length < 2) {
            errors.push("A tournament must contain at least two teams.");
        }

        //Setup our modal
        var confirmationContent = $("#confirmationBody");
        confirmationContent.html("");
        var confirmButton = $("#confirmationConfirm");

        if(errors.length > 0) {
            //Report any errors
            var errorList = "<ul>";
            $.each(errors, function (index, error) {
                errorList += "<li>" + error + "</li>";
            });
            errorList += "</ul><p>You need to go back and resolve these conflicts to proceed.</p>";

            confirmationContent.append("<h3>Errors</h3>" + errorList);

            //Disable the confirm button
            Global.disableButton(confirmButton);
        } else {

            confirmationContent.append("<p>You are creating a tournament with the following details:</p>");

            //Generate the venueList
            var venuesList = "<div class='half-grid'><h3>Venues</h3><ul>";
            $.each(venues, function(index, venue) {
                venuesList += "<li>" + venue + "</li>";
            });
            venuesList += "</ul></div>";
            confirmationContent.append(venuesList);

            //Generate the teamList
            var teamsList = "<div class='half-grid'><h3>Teams</h3><ul>";
            $.each(teams, function(index, team) {
                teamsList += "<li>" + team + "</li>";
            });
            teamsList += "</ul></div>";
            confirmationContent.append(teamsList);

            //Enable the confirm button
            Global.enableButton(confirmButton);
        }

        //Get a reference to our modal
        var confirmationModal = $("#confirmationModal");

        //Perform some display styling on the modal
        confirmationContent.css({"overflowY": "auto"});
        confirmationContent.css({"height": ""});

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

    /**
     * Saves a record that is being edited in our table, back into the table.
     * @param ref the referring item that was clicked.
     * @param oldValue the old value that we are updating to the new value.
     * @param type the type of record we are saving: venue or team;
     */
    function save(ref, oldValue, type) {
        //Get the current value
        var item = $(ref).parent().parent().children()[0];
        var itemValue = $($(item).children()[0]).val();

        //Update the value to the new value
        if(type === 'venue') {
            venues[$.inArray(oldValue, venues)] = itemValue;
        } else if (type === 'team') {
            teams[$.inArray(oldValue, teams)] = itemValue;
        }
        $(item).html(itemValue);
        $($(ref).parent().parent().children()[1]).attr("value", itemValue);

        //Set the remove button to hidden
        $($(ref).siblings()[0]).attr("type", "button");

        //Update and reregister the button
        $(ref).attr("value", "Edit");
        $(ref).off('click').click(function(){
            edit(ref, type);
        });
    }

    /**
     * Removes a table row from our venues or teams table so that they will no longer be added to the tournament.
     * @param ref the referring item that was clicked.
     * @param type the type of record we are removing; venue or team.
     */
    function remove(ref, type) {
        //Get the data
        var data = $($(ref).parent().parent().children()[0]).html();

        //Check what type of remove we are doing
        if(type === 'venue') {
            venues.splice($.inArray(data, venues), 1);

            if(venues.length === 0) {
                $(ref).parent().parent().parent().parent().parent().html("<p>You currently have no venues for this tournament.</p>");
            } else {
                //Remove the row
                $(ref).parent().parent().remove();
            }
        } else if (type === 'team') {
            teams.splice($.inArray(data, teams), 1);

            if(teams.length === 0) {
                $(ref).parent().parent().parent().parent().parent().html("<p>You currently have no teams for this tournament.</p>");
            } else {
                //Remove the row
                $(ref).parent().parent().remove();
            }
        }
    }

    /**
     * Allows a venue or team record in our venues or teams table to be updated inline.
     * @param ref the referring item that was clicked.
     * @param type the type of record we are editing; venue or team.
     */
    function edit(ref, type) {
        //Get the item
        var item = $(ref).parent().parent().children()[0];
        var oldValue = $($(ref).parent().parent().children()[1]).val();

        //Update the table cell
        $(item).html("<input type='text' value='" + oldValue + "'>");

        //Update and re-register the button
        $(ref).attr("value", "Save");
        $(ref).off('click').click(function() {
            save(ref, oldValue, type);
        });

        //Set the remove button to hidden
        $($(ref).siblings()[0]).attr("type", "hidden");

        //Register enter press on save
        $(item).keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                save(ref, oldValue, type);
            }
        });
    }

    /**
     * This functions takes a venue from our teams input box and then adds it to the venues table on our create page.
     */
    function addVenue() {
        //Get the value to add
        var venue = $("#txtVenue");

        //Remove any errors
        if(venue.parents('.tooltip').length) {
            $(venue).css({"borderColor": "#B9B9B9"});
            $(venue).unwrap();
            $($(venue).siblings()[0]).remove();
        }

        //Validate the venue
        if($.inArray($(venue).val(), venues) !== -1) {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(venue).wrap("<div class='tooltip'>");
            $(venue).after("<span class='tooltipMessage' style='left: 15%'>You've already added that venue.</span>");
            $(venue).css({"borderColor": "red"});
            return;
        }

        if($(venue).val() === '') {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(venue).wrap("<div class='tooltip'>");
            $(venue).after("<span class='tooltipMessage' style='left: 15%'>You must enter a venue.</span>");
            $(venue).css({"borderColor": "red"});
            return;
        }

        if (!venue.val().replace(/\s/g, '').length) {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(venue).wrap("<div class='tooltip'>");
            $(venue).after("<span class='tooltipMessage' style='left: 15%'>A venue cannot be a blank string.</span>");
            $(venue).css({"borderColor": "red"});
            return;
        }

        //Add the venue to the list
        if(venues.length === 0) {
            $("#venuesDiv").html("<table class='tournamentTable'><thead><tr><th>Title</th><th>Action</th></tr></thead><tbody>" +
                "<tr><td>" + $(venue).val() + "</td><input type='hidden' value='" + $(venue).val() +"' name='venues[]'>" +
                "<td><input type='button' value='Edit' class='editBtn'><input type='button' value='Remove' class='removeBtn'></td></tr>" +
                "</tbody></table>");
            venues.push($(venue).val());
        } else {
            $($($("#venuesDiv").children()[0]).children()[1]).append("<tr><td>" + $(venue).val() + "</td><input type='hidden' value='" + $(venue).val() +"' name='venues[]'>" +
                "<td><input type='button' value='Edit' class='editBtn'><input type='button' value='Remove' class='removeBtn'></td>" +
                "</tr>");
            venues.push($(venue).val());
        }

        //Remove text from input
        $($(this).siblings()[0]).val("");

        //Register the edit and remove button handlers
        $("#venuesDiv .editBtn").click(function() {
            edit(this, "venue");
        });
        $("#venuesDiv .removeBtn").off("click").click(function() {
            remove(this, "venue");
        });
    }

    /**
     * This functions takes a team from our teams input box and then adds it to the teams table on our create page.
     */
    function addTeam() {
        //Get the value to add
        var team = $("#txtTeam");

        //Remove any errors
        if(team.parents('.tooltip').length) {
            $(team).css({"borderColor": "#B9B9B9"});
            $(team).unwrap();
            $($(team).siblings()[0]).remove();
        }

        //Validate the team
        if($.inArray($(team).val(), teams) !== -1) {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(team).wrap("<div class='tooltip'>");
            $(team).after("<span class='tooltipMessage' style='left: 15%'>You've already added that team.</span>");
            $(team).css({"borderColor": "red"});
            return;
        }

        if($(team).val() === '') {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(team).wrap("<div class='tooltip'>");
            $(team).after("<span class='tooltipMessage' style='left: 15%'>You must enter a team.</span>");
            $(team).css({"borderColor": "red"});
            return;
        }

        if (!team.val().replace(/\s/g, '').length) {
            //It isn't valid, create the tooltip, set the border color to red for failure and disable the save all button
            $(team).wrap("<div class='tooltip'>");
            $(team).after("<span class='tooltipMessage' style='left: 15%'>A venue cannot be a blank string.</span>");
            $(team).css({"borderColor": "red"});
            return;
        }

        //Add the team to the list
        if(teams.length === 0) {
            $("#teamsDiv").html("<table class='tournamentTable'><thead><tr><th>Title</th><th>Action</th></tr></thead><tbody>" +
                "<tr><td>" + $(team).val() + "</td><input type='hidden' value='" + $(team).val() +"' name='teams[]'>" +
                "<td><input type='button' value='Edit' class='editBtn'><input type='button' value='Remove' class='removeBtn'></td></tr>" +
                "</tbody></table>");
            teams.push($(team).val());
        } else {
            $($($("#teamsDiv").children()[0]).children()[1]).append("<tr><td>" + $(team).val() + "</td><input type='hidden' value='" + $(team).val() +"' name='teams[]'>" +
                "<td><input type='button' value='Edit' class='editBtn'><input type='button' value='Remove' class='removeBtn'></td>" +
                "</tr>");
            teams.push($(team).val());
        }

        //Remove text from input
        $($(this).siblings()[0]).val("");

        //Register the edit and remove button handlers
        $("#teamsDiv .editBtn").click(function() {
            edit(this, "team");
        });
        $("#teamsDiv .removeBtn").off("click").click(function() {
            remove(this, "team");
        });
    }


    /**
     * This public function acts as a setup for our JS file and is called when the document has loaded. It adds the
     * click events to our Add Venue and Add Team buttons and also enables them so that when you press enter in the form
     * it completes the same function as pressing them.
     */
    pub.setup = function () {
        //Register the button event listeners
        $("#addVenueBtn").click(addVenue);
        $("#addTeamBtn").click(addTeam);

        //Register enter press on venues and teams
        $("#txtVenue").keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                addVenue();
                $(this).val("");
            }
        });

        $("#txtTeam").keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                addTeam();
                $(this).val("");
            }
        });

        $("#createTournamentBtn").click(validate);
    };

    return pub;
}());

//Load the Fixtures.setup function when the page has loaded
$(document).ready(Create.setup);