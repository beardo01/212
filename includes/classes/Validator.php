<?php

/**
 * A class to hold all of the validation functions that the website requires to validate input.
 * Created by PhpStorm.
 * User: oreid
 * Date: 10/3/16
 * Time: 5:23 PM
 */

class Validator
{
    private $tournamentXML;
    private $venuesXML;
    private $errors = [];

    /**
     * Takes matches in a tournament and input and validates that there are no clashes of teams or venues on the same
     * date.
     * @param $editingMatches array of matches that are being changed.
     * @param $nonEditingMatches array of matches that are not being changed.
     * @return array|bool an array if there were errors in the validation, or true if it completed successfully.
     */
    public function validateTournament($editingMatches, $nonEditingMatches) {
        //Reset the errors array
        $this->errors = [];

        //Check that one team isn't playing more than once on the same day.
        foreach($editingMatches as $editingMatch) {
            //Check the match against itself
            if($editingMatch['team1'] == $editingMatch['team2']) {
                $this->errors[] = "Match ". $editingMatch['matchID'] ." cannot have a team verse itself.";
            }

            //We want to check all the other matches that are being edited
            foreach($editingMatches as $otherEditingMatch) {
                //If we are checking the same match we skip it
                if($editingMatch == $otherEditingMatch) {
                    continue;
                } else {
                    //If the matches have different dates we skip it
                    if(DateTime::createFromFormat("j/n/Y", $editingMatch['date'])->getTimestamp() != DateTime::createFromFormat("j/n/Y", $otherEditingMatch['date'])->getTimestamp()  || $otherEditingMatch['date'] == '//') {
                        continue;
                    } else {
                        //Check if the venue is the same
                        if($editingMatch['venue'] == $otherEditingMatch['venue']) {
                            $this->errors[] = "We've detected a clash with another match you're editing. Match ". $editingMatch['matchID'] ." has a venue conflict with Match ". $otherEditingMatch['matchID'] .".";
                        }

                        //Check if the teams are the same
                        if($editingMatch['team1'] == $otherEditingMatch['team1'] || $editingMatch['team1'] == $otherEditingMatch['team2'] || $editingMatch['team2'] == $otherEditingMatch['team1'] || $editingMatch['team2'] == $otherEditingMatch['team2']) {
                            $this->errors[] = "We've detected a clash with another match you're editing. Match ". $editingMatch['matchID'] ." has a team conflict with Match ". $otherEditingMatch['matchID'] .".";
                        }
                    }
                }
            }

            //We want to check normal matches that aren't being edited
            foreach($nonEditingMatches as $nonEditingMatch) {
                //If the matches have different dates or it isn't defined, we skip it
                if($nonEditingMatch['date'] == '//') {
                    continue;
                }
                if(DateTime::createFromFormat("j/n/Y", $editingMatch['date'])->getTimestamp() != DateTime::createFromFormat("j/n/Y", $nonEditingMatch['date'])->getTimestamp() || $nonEditingMatch['date'] == '//') {
                    continue;
                } else {
                    //Check if the venue is the same
                    if($editingMatch['venue'] == $nonEditingMatch['venue']) {
                        $this->errors[] = "We've detected a clash with another match. Match ". strtotime($editingMatch['date']) ." has a venue conflict with Match ". strtotime($nonEditingMatch['date']) .".";
                    }

                    //Check if the teams are the same
                    if($editingMatch['team1'] == $nonEditingMatch['team1'] || $editingMatch['team1'] == $nonEditingMatch['team2'] || $editingMatch['team2'] == $nonEditingMatch['team1'] || $editingMatch['team2'] == $nonEditingMatch['team2']) {
                        $this->errors[] = "We've detected a clash with another match. Match ". $editingMatch['matchID'] ." has a team conflict with Match ". $nonEditingMatch['matchID'] .".";
                    }
                }
            }
        }

        //Return status
        if(empty($this->errors)) {
            return true;
        } else {
            return $this->errors;
        }
    }

    /**
     * A helper function which packages up all of the other validation functions to validate user input.
     * @param $match match whose input we want to validate.
     * @param $type string status of new or update determining whether it is a new match or a match being edited.
     * @return array|bool array of errors if the validation failed, or true if it passed.
     */
    public function validateInput($match, $type) {
        //Reset the errors array
        $this->errors = [];

        //Check teams
        $this->validTeams($match->getTeam1(), $match->getTeam2(), $type);

        //Check scores
        $this->validScores($match->getScore1(), $match->getScore2());

        //Check venue
        $this->validVenue($match->getVenue(), $type);

        //Check date
        $this->validDate($match->getDate());

        //Return status
        if(empty($this->errors)) {
            return true;
        } else {
            return $this->errors;
        }
    }

    /**
     * Validates that a matches venue is valid.
     * @param $venue string venue to validate.
     * @return array|bool array of errors if the validation failed, or true if it passed.
     */
    public function validateVenue($venue) {
        //Reset the errors array
        $this->errors = [];

        //Check venue
        $this->validVenue($venue, 'new');

        //Return status
        if(empty($this->errors)) {
            return true;
        } else {
            return $this->errors;
        }
    }

    /**
     * Validates that a matches teams are valid.
     * @param $team string the team to validate.
     * @return array|bool array of errors if the validation failed, or true if it passed.
     */
    public function validateTeam($team) {
        //Reset the errors array
        $this->errors = [];

        //Check venue
        $this->validTeam($team);

        //Return status
        if(empty($this->errors)) {
            return true;
        } else {
            return $this->errors;
        }
    }

    /**
     * Validates that a matches date is valid.
     * @param $date string the date to validate.
     */
    private function validDate($date) {
        //Check that there is input.
        if(empty($date)) {
            $this->errors[] = "You need to select a date.";
            return;
        }

        //Check the input is valid.
        $format = 'j/n/Y';
        $d = DateTime::createFromFormat($format, $date);
        if($d->format($format) != $date) {
            $this->errors[] = "You must enter a valid date in DD/MM/YYYY format.";
        }
    }

    /**
     * Validates that a matches venue is valid.
     * @param $venue string the venue to validate.
     * @param $type string whether the match is a new match or an updating match.
     */
    private function validVenue($venue, $type) {
        //Check that the venue exists.
        if($type == 'update') {
            if(!in_array($venue, $this->getVenues())) {
                $this->errors[] = "You have selected a venue '$venue' that does not exist.";
            }
        }

        //Check that the input is valid.
        if(empty($venue)) {
            if($type == 'new') {
                $this->errors[] = "You cannot create a blank venue.";
            } else {
                $this->errors[] = "You need to select a venue.";
            }
        }

        if($type == 'new') {
            //Check that the valid isn't just a blank space.
            if (ctype_space($venue)) {
                $this->errors[] = "A venue name cannot be a blank string.";
            }
        }
    }

    /**
     * Validates whether a matches team is valid.
     * @param $team string the team to validate.
     */
    private function validTeam($team) {
        //Check that the input is valid.
        if(empty($team)) {
            $this->errors[] = "You cannot create a blank team.";
        }

        //Check that the valid isn't just a blank space.
        if (ctype_space($team)) {
            $this->errors[] = "A team name cannot be a blank string.";
        }
    }

    /**
     * Validates whether a matches scores are valid.
     * @param $score1 string the score of the first team to validate.
     * @param $score2 string the score of the second team to validate.
     */
    private function validScores($score1, $score2) {
        //Check that scores are entered, are positive and are an integer.
        if($score1 < 0 || $score1 > 99 || !ctype_digit((String) $score1) && $score1 != '') {
            $this->errors[] = "You must enter a positive integer score for the first team.";
        }

        if($score2 < 0 || $score2 > 99 || !ctype_digit((String) $score2) && $score2 != '') {
            $this->errors[] = "You must enter a positive integer score for the second team.";
        }

    }

    /**
     * Validates whether a matches teams are valid.
     * @param $team1 string the name of the first team to validate.
     * @param $team2 string the name of the second team to validate.
     * @param $type string whether the match is new or being updated.
     */
    private function validTeams($team1, $team2, $type) {
        //Check that the team exists.
        if($type == 'update') {
            //Check that team is a valid team.
            if(!in_array($team1, $this->getTeams())) {
                $this->errors[] = "You have selected a team '$team1' that does not exist.";
            }

            if(!in_array($team2, $this->getTeams())) {
                $this->errors[] = "You have selected a team '$team2' that does not exist.";
            }
        }

        //Check that the input is valid.
        if(empty($team1)) {
            $this->errors[] = "You need to select team one.";
        }

        if(empty($team2)) {
            $this->errors[] = "You need to select team two.";
        }
    }

    /**
     * This function opens the XML and retrieves all of the teams in the file for input validation.
     * @return array An array holding all of the teams in the competition.
     */
    private function getTeams() {
        if(file_exists($this->tournamentXML)) {
            //Open the file
            $matches = simplexml_load_file($this->tournamentXML);

            //Add each team to the array
            $teams = [];
            foreach($matches as $match) {
                //Add the teams to the array
                if(!in_array($match->team[0], $teams)) {
                    $teams[] = (String) $match->team[0];
                }

                if(!in_array($match->team[1], $teams)) {
                    $teams[] = (String) $match->team[1];
                }
            }

        } else {
            exit("Error reading the XML file: $this->tournamentXML");
        }
        return $teams;
    }

    /**
     * This function opens the XML and retrieves all of the venues in the file for input validation.
     * @return array An array holding all of the venues in the competition.
     */
    private function getVenues() {
        if(file_exists($this->venuesXML)) {
            //Open the file
            $xmlVenues = simplexml_load_file($this->venuesXML);

            //Add each team to the array
            $venues = [];
            foreach($xmlVenues as $venue) {
                //Add the venues to the array
                if(!in_array($venue[0], $venues)) {
                    $venues[] = (String) $venue[0];
                }
            }

        } else {
            exit("Error reading the XML file: $this->venuesXML");
        }
        return $venues;
    }

    /**
     * Validator constructor which passes the classes private members the link to the tournament and venues XML.
     * @param $tournamentXML
     * @param $venuesXML
     */
    public function __construct($tournamentXML, $venuesXML)
    {
        $this->tournamentXML = $tournamentXML;
        $this->venuesXML = $venuesXML;
    }

}