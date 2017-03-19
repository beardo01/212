<?php

/**
 * A class that provides an interface between the website and the XML. It allows us to perform different common XML
 * activities that the website required.
 * Created by PhpStorm.
 * User: oreid
 * Date: 10/6/16
 * Time: 12:24 AM
 */
class XML
{
    private $tournamentXML;
    private $venuesXML;

    /**
     * Constructs the XML class providing the classes methods with links to the XML.
     * @param $tournamentXML
     * @param $venuesXML
     */
    public function __construct($tournamentXML, $venuesXML)
    {
        $this->tournamentXML = $tournamentXML;
        $this->venuesXML = $venuesXML;
    }

    /**
     * Creates a round robin tournament for an array of teams.
     * @param $teams array of teams to create the tournament for.
     * @return array the round robin tournament.
     */
    private function generateMatches($teams) {
        //Declare a matches array to hold match data
        $matches = [];
        $rounds = [];

        //Check to see if we have an even number of teams
        if(count($teams) % 2 != 0) {
            $teams[] = "TempTeam";
        }

        //Setup our away and home matches
        $awayMatches = array_splice($teams, (count($teams)/2));
        $homeMatches = $teams;

        //Populate our away and home match arrays
        for($i = 0; $i < count($homeMatches)+(count($awayMatches) - 1); $i++) {
            for ($j = 0; $j < count($homeMatches); $j++) {
                $rounds[$i][$j]['Home'] = $homeMatches[$j];
                $rounds[$i][$j]['Away'] = $awayMatches[$j];
            }
            if (count($homeMatches) + (count($awayMatches) - 1) > 2) {
                array_unshift($awayMatches, array_shift(array_splice($homeMatches, 1, 1)));
                $homeMatches[] = array_pop($awayMatches);
            }
        }

        //Create each match and push it to our matches array
        foreach($rounds as $round => $match) {
            foreach($match as $team) {
                //If either team is the temp team, we don't add it.
                if($team['Home'] == 'TempTeam' || $team['Away'] == 'TempTeam') {
                    continue;
                }
                $matches[] = new Match($round, $team['Home'], $team['Away'], '', '', '', '');
            }
        }

        //Return our round robin tournament
        return $matches;
    }

    /**
     * Creates a tournament from a given list of venues and teams.
     * @param $venues array of venues to add to the tournament.
     * @param $teams array of teams to add to the tournament.
     * @return bool whether the tournament could be created or not.
     */
    public function createTournament($venues, $teams) {
        //Add the venues to venues XML
        if(file_exists($this->venuesXML)) {
            //Open the XML file
            $venueXML = simplexml_load_file($this->venuesXML);

            //Remove the current contents
            foreach ($venueXML->xpath('venue') as $venue) {
                unset($venue[0]);
            }

            //Write the new contents
            foreach($venues as $venue) {
                $venueXML->addChild('venue', htmlspecialchars($venue));
            }

            //Save the venues XML
            $venueXML->saveXML($this->venuesXML);
        } else {
            return false;
        }

        //Add the teams to teams XML
        if(file_exists($this->venuesXML)) {
            //Open the XML file
            $teamXML = simplexml_load_file($this->tournamentXML);

            //Remove the current contents
            foreach ($teamXML->xpath('match') as $match) {
                unset($match[0]);
            }

            //Generate the tournament
            $matches = $this->generateMatches($teams);

            //Write the new contents
            foreach($matches as $match) {
                $newMatch = $teamXML->addChild('match');
                $date = $newMatch->addChild('date');
                $date->addChild('day');
                $date->addChild('month');
                $date->addChild('year');
                $newMatch->addChild('venue');
                $team1 = $newMatch->addChild('team', htmlspecialchars($match->getTeam1()));
                $team1->addAttribute('score');
                $team2 = $newMatch->addChild('team', htmlspecialchars($match->getTeam2()));
                $team2->addAttribute('score');
            }

            //Save the venues XML
            $teamXML->saveXML($this->tournamentXML);
        } else {
            return false;
        }
        return true;
    }

    /**
     * Takes a match and updates its in the XML.
     * @param $match match to update.
     * @return bool whether the match could be updated or not.
     * @property match match to update (this should remove any warnings about 'field accessed via magic method').
     */
    public function updateMatch($match) {
        if(file_exists($this->tournamentXML)) {
            //Open the XML file
            $tournament = simplexml_load_file($this->tournamentXML);

            //Update the match details
            $tournament->match[$match->getMatchID() - 1]->team[0][0] = htmlspecialchars($match->getTeam1());
            if(sizeof($tournament->match[$match->getMatchID() - 1]->team[0]->attributes()) == 0 && $match->getScore1() != '') {
                $tournament->match[$match->getMatchID() - 1]->team[0]->addAttribute('score', htmlspecialchars($match->getScore1()));
            } else if ($match->getScore1() != '') {
                $tournament->match[$match->getMatchID() - 1]->team[0]->attributes()->score = htmlspecialchars($match->getScore1());
            }
            $tournament->match[$match->getMatchID() - 1]->team[1][0] = htmlspecialchars($match->getTeam2());
            if(sizeof($tournament->match[$match->getMatchID() - 1]->team[1]->attributes()) == 0 && $match->getScore2() != '') {
                $tournament->match[$match->getMatchID() - 1]->team[1]->addAttribute('score', htmlspecialchars($match->getScore2()));
            } else if ($match->getScore2() != '') {
                $tournament->match[$match->getMatchID() - 1]->team[1]->attributes()->score = htmlspecialchars($match->getScore2());
            }
            $tournament->match[$match->getMatchID() - 1]->venue = htmlspecialchars($match->getVenue());

            $date = DateTime::createFromFormat('j/n/Y', $match->getDate());
            $tournament->match[$match->getMatchID() - 1]->date->day = htmlspecialchars($date->format('j'));
            $tournament->match[$match->getMatchID() - 1]->date->month = htmlspecialchars($date->format('n'));
            $tournament->match[$match->getMatchID() - 1]->date->year = htmlspecialchars($date->format('Y'));

            //Save the XML file
            $tournament->saveXML($this->tournamentXML);

            return true;
        } else {
            return false;
        }
    }
}