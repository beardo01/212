<?php
include("includes/head.php");
?>

    <!-- Content -->
    <div class="content">
        <h2>Create Tournament</h2>
        <hr>
        <!-- Page Content -->
        <h3>Add Venues</h3>
        <form method="POST" action="includes/tournamentCreate.php" id="createTournamentForm">
            <div class="half-grid left-grid">
                <input type="text" name="venue" placeholder="Enter the name of a venue to add" id="txtVenue" class="form-inline">
                <input type="button" name="addVenueBtn" id="addVenueBtn" value="Add Venue" class="form-inline">
            </div>
            <div class="half-grid right-grid" id="venuesDiv">
                <p>You currently have no venues for this tournament.</p>
            </div>
            <div class="clear"></div>
            <h3>Add Teams</h3>
            <div class="half-grid left-grid">
                <input type="text" name="team" placeholder="Enter the name of a team to add" id="txtTeam" class="form-inline">
                <input type="button" name="addTeamBtn" id="addTeamBtn" value="Add Team" class="form-inline">
            </div>
            <div class="half-grid right-grid" id="teamsDiv">
                <p>You currently have no teams for this tournament.</p>
            </div>
            <div class="clear"></div>
            <input type="button" name="createTournamentBtn" id="createTournamentBtn" value="Create Tournament">

            <!-- Conformation Model -->
            <div id="confirmationModal" class="modal">
                <!-- Modal Content -->
                <div class="modal-content">
                    <div class="modal-header">
                        <span id="confirmationClose" class="modalClose">×</span>
                        <h3>Match Change Confirmation</h3>
                    </div>
                    <div class="modal-body" id="confirmationBody">
                        <div class="half-grid left-grid" id="venuesList"></div>
                        <div class="half-grid" id="teamsList"></div>
                    </div>
                    <div class="modal-footer">
                        <input type="submit" value="Confirm" id="confirmationConfirm" class="confirmButton">
                    </div>
                </div>
                <!-- /Modal Content -->
            </div>
            <!-- /Conformation Model -->

            <!-- Response Model -->
            <div id="responseModal" class="modal">
                <!-- Modal Content -->
                <div class="modal-content">
                    <div class="modal-header">
                        <span id="responseClose" class="modalClose">×</span>
                        <h3 id="responseTitle">You haven't submitted any data yet!</h3>
                    </div>
                    <div class="modal-body" id="responseBody">
                        <p>You haven't submitted any data yet!</p>
                    </div>
                    <div class="modal-footer">
                        <input type="button" value="Confirm" id="responseConfirm" class="confirmButton">
                    </div>
                </div>
                <!-- /Modal Content -->
            </div>
            <!-- /Response Model -->
        </form>
        <!-- /Page Content -->
    </div>
    <!-- /Content -->

<?php
$scriptList = ['create.js', 'createSubmit.js'];
include("includes/foot.php");
?>