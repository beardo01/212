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

//Get variables and define our match types
$allMatches = $_POST['match'];
$editingMatches = [];
$nonEditingMatches = [];

//Split the matches into ones that are being edited and ones that are not
foreach($allMatches as $key => $match) {
    if($match['editing'] == 1) {
        $editingMatches[] = $match;
    } else {
        $nonEditingMatches[] = $match;
    }
}

//Perform validation
$errors = [];
$validatedMatches = [];

//Create the validator object
$validator = new Validator($tournamentXML, $venuesXML);

//Perform input validation
foreach($editingMatches as $key => $match) {
    //Create validator and the match.
    $validationMatch = new Match($match['matchID'], $match['team1'], $match['team2'], $match['score1'], $match['score2'], $match['venue'], $match['date']);
    
    //Push the match to the validation array.
    $validatedMatches[] = $validationMatch;

    //Validate the match.
    $matchValidated = $validator->validateInput($validationMatch, 'update');

    //If the validation fails, add it
    if(is_array($matchValidated)) {
        $errors[$match['matchID']] = $matchValidated;
    }
}

//Perform tournament validation
$tournamentValidated = $validator->validateTournament($editingMatches, $nonEditingMatches);

//If the validation fails, add it
if(is_array($tournamentValidated)) {
    $errors['tournament'] = $tournamentValidated;
}

//Create the response array
$response = ['status' => 'null', 'data' => ''];

//Generate the response based on whether we have errors or not
if(empty($errors)) {
    $response['status'] = 'success';
    $xml = new XML($tournamentXML, $venuesXML);
    foreach($validatedMatches as $match) {
        //Update it
        $xml->updateMatch($match);
    }
} else {
    $response['status'] = 'failure';
    $response['data'] = $errors;
}

//Encode it as JSON
$json_string = json_encode($response, JSON_PRETTY_PRINT);

//Output the JSON
echo $json_string;