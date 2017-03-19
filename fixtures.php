<?php
    include("includes/head.php");
?>

<!-- Content -->
<div class="content">
    <h2>Fixtures</h2>
    <hr>
    <!-- Page Content -->
    <h3>Games Played</h3>
    <table id="played" class="borderTable">
        <caption>This shows the games that have already been played in the tournament.</caption>
        <thead>
        <tr>
            <th scope="col" colspan="2">Team 1</th>
            <th scope="col" colspan="2">Team 2</th>
            <th scope="col">Venue</th>
            <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <h3>Games to be Played</h3>
    <table id="toplay" class="borderTable">
        <caption>This shows the games that are yet to be played in the tournament.</caption>
        <thead>
        <tr>
            <th scope="col" colspan="2">Team 1</th>
            <th scope="col" colspan="2">Team 2</th>
            <th scope="col">Venue</th>
            <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    <!-- /Page Content -->
</div>
<!-- /Content -->

<?php
    $scriptList = ['fixtures.js'];
    include("includes/foot.php");
?>