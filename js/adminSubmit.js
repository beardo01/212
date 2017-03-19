/**
 * Created by oreid on 10/4/16.
 */
var AdminSubmit = (function(){
    "use strict";
    var pub = {};

    /**
     * This method makes a AJAX call to updateMatch form's action URL and gets a response in JSON. It then reads this
     * response and acts accordingly; if it is successful it displays a success modal, otherwise a failure modal with
     * the reasons why it failed.
     * @type {*|jQuery}
     */
    pub.adminForm = $('#updateMatch').on('submit', function(e) {
        e.preventDefault();
        
        //Prepare the modal.
        var responseContent = $("#responseBody");
        responseContent.html("");

        //Make the ajax request to our PHP validation form.
        $.ajax({
            url : $(this).attr('action') || window.location.pathname,
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            success: function (data) {
                //Get the editable part of the modal.
                var responseTitle = $("#responseTitle");
                var responseBody = $("#responseBody");

                //Check the status of our JSON response
                if(data['status'] === 'success') {
                    //Update the title
                    $(responseTitle).html("You have successfully updated the tournament!");

                    //Update the body
                    $(responseBody).html("<i class='fa fa-check-circle-o fa-4x'></i><p>You have successfully modified the tournament!</p>");
                } else {
                    //Update the title
                    $(responseTitle).html("We couldn't update the tournament!");

                    //Declare the error messages
                    var errorMessages = "";

                    //Generate the errors
                    $.each(data['data'], function(matchID, errors) {
                        if(matchID === 'tournament') {
                            return true;
                        } else {
                            errorMessages += "<h3>Match " + matchID + " contained the following errors:</h3><ul>";
                            $.each($.makeArray(errors), function (error) {
                                errorMessages += "<li>" + errors[error] + "</li>";
                            });
                            errorMessages += "</ul>";
                        }
                    });

                    $.each(data['data'], function(matchID, errors) {
                        if(matchID !== 'tournament') {
                            return true;
                        } else {
                            errorMessages += "<h3>The tournament contained the following errors:</h3><ul>";
                            $.each($.makeArray(errors), function (error) {
                                errorMessages += "<li>" + errors[error] + "</li>";
                            });
                            errorMessages += "</ul>";
                        }
                    });

                    //Update the body
                    $(responseBody).html("<i class='fa fa-times-circle-o fa-4x'></i><p>" + errorMessages + "</p>");
                }

                //Get a reference to our modal
                var responseModal = $("#responseModal");
                var confirmationModal = $("#confirmationModal");

                //Animate the confirmationModal to disappear
                confirmationModal.css({"display": "none"});
                confirmationModal.animate({"top": "-200", "opacity": "0"});

                //Animate the responseModal to appear
                responseModal.css({"display": "block"});
                responseModal.animate({"top": "0", "opacity": "1"});

                //Get a reference to our button
                var responseButton = $("#responseConfirm");

                //Register the button events depending on whether it was successful or not
                if(data['status'] === 'success') {
                    //Update the button
                    $(responseButton).attr("value", "Okay!");
                    $(responseButton).click(function() {
                        location.reload();
                    });

                    //Create the close button click event
                    $("#responseClose").click(function() {
                        location.reload();
                    });
                } else {
                    //Update the button
                    $(responseButton).attr("value", "Close");
                    $(responseButton).click(function() {
                        responseModal.css({"display": "none"});
                        responseModal.animate({"top": "-200", "opacity": "0"});
                    });

                    //Create the close button click event
                    $("#responseClose").click(function() {
                        responseModal.css({"display": "none"});
                        responseModal.animate({"top": "-200", "opacity": "0"});
                    });
                }
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });

    return pub;
}());

//Load the Global function when the page has loaded
$(document).ready(AdminSubmit);