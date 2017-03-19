<?php

/**
 * A class that holds the details about a match.
 * Created by PhpStorm.
 * User: oreid
 * Date: 10/3/16
 * Time: 5:25 PM
 */
class Match
{
    private $matchID;
    private $team1;
    private $team2;
    private $score1;
    private $score2;
    private $venue;
    private $date;

    function __toString()
    {
        return "matchID = $this->matchID, team1 = $this->team1, team2 = $this->team2, score1 = $this->score1, score2 = $this->score2, venue = $this->venue, date = $this->date";
    }

    /**
     * Match constructor.
     * @param matchID
     * @param $team1
     * @param $team2
     * @param $score1
     * @param $score2
     * @param $venue
     * @param $date
     */
    public function __construct($matchID, $team1, $team2, $score1, $score2, $venue, $date)
    {
        $this->matchID = $matchID;
        $this->team1 = $team1;
        $this->team2 = $team2;
        $this->score1 = $score1;
        $this->score2 = $score2;
        $this->venue = $venue;
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getMatchID()
    {
        return $this->matchID;
    }

    /**
     * @param mixed $matchID
     */
    public function setMatchID($matchID)
    {
        $this->matchID = $matchID;
    }

    /**
     * @return mixed
     */
    public function getTeam1()
    {
        return $this->team1;
    }

    /**
     * @param mixed $team1
     */
    public function setTeam1($team1)
    {
        $this->team1 = $team1;
    }

    /**
     * @return mixed
     */
    public function getTeam2()
    {
        return $this->team2;
    }

    /**
     * @param mixed $team2
     */
    public function setTeam2($team2)
    {
        $this->team2 = $team2;
    }

    /**
     * @return mixed
     */
    public function getScore1()
    {
        return $this->score1;
    }

    /**
     * @param mixed $score1
     */
    public function setScore1($score1)
    {
        $this->score1 = $score1;
    }

    /**
     * @return mixed
     */
    public function getScore2()
    {
        return $this->score2;
    }

    /**
     * @param mixed $score2
     */
    public function setScore2($score2)
    {
        $this->score2 = $score2;
    }

    /**
     * @return mixed
     */
    public function getVenue()
    {
        return $this->venue;
    }

    /**
     * @param mixed $venue
     */
    public function setVenue($venue)
    {
        $this->venue = $venue;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

}