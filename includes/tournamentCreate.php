<?php
/**
 * Created by PhpStorm.
 * User: oreid
 * Date: 10/3/16
 * Time: 4:02 PM
 */

include("classes/Match.php");
include("classes/Validator.php");
include("classes/XML.php");
include("XML.php");

//Get form POST data
$venues = $_POST['venues'];
$teams = $_POST['teams'];

//Remove duplicates
$venues = array_unique($venues, SORT_STRING);
$teams = array_unique($teams, SORT_STRING);

//Perform validation
$errors = [];
$validatedMatches = [];

//Perform some basic validation
if(sizeof($venues) < 1) {
    $errors['tournament'][] = "A tournament must contain at least one venue.";
}

if(sizeof($teams) < 2) {
    $errors['tournament'][] = "A tournament must contain at least two teams.";
}

//Create the validator object
$validator = new Validator($tournamentXML, $venuesXML);

//Perform input validation on venues and teams
foreach($venues as $key => $venue) {
    $venueValidated = $validator->validateVenue($venue);

    if (is_array($venueValidated)) {
        $errors['venues'][$key] = $venueValidated;
    }
}

foreach($teams as $key => $team) {
    $teamValidated = $validator->validateTeam($team);

    if (is_array($teamValidated)) {
        $errors['teams'][$key] = $teamValidated;
    }
}

//Create the response array
$response = ['status' => 'null', 'data' => ''];

if(empty($errors)) {
    $response['status'] = 'success';
    $xml = new XML($tournamentXML, $venuesXML);
    $xml->createTournament($venues, $teams);
} else {
    $response['status'] = 'failure';
    $response['data'] = $errors;
}

//Encode it as JSON
$json_string = json_encode($response, JSON_PRETTY_PRINT);

//Output the JSON
echo $json_string;