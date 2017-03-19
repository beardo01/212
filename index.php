<?php
    include("includes/head.php");
?>

<!-- Content -->
<div class="content">
    <h2>Home</h2>
    <hr>
    <!-- Page Content -->
    <p>Welcome to World Scores. On this website you can view the current standings table, view played matches and matches to be played, and enter administrative match information.</p>
    <h3>Standings Table</h3>
    <table id="standings">
        <caption>This shows the current standings of all teams for games already played.</caption>
        <thead>
            <tr>
                <th scope="col">Rank</th>
                <th scope="col">Team</th>
                <th scope="col">Played</th>
                <th scope="col">Won</th>
                <th scope="col">Drawn</th>
                <th scope="col">Lost</th>
                <th scope="col">For</th>
                <th scope="col">Against</th>
                <th scope="col">Diff.</th>
                <th scope="col">Points</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <!-- /Page Content -->
</div>
<!-- /Content -->

<?php
    $scriptList = ['standings.js'];
    include("includes/foot.php");
?>