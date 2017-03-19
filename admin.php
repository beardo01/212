<?php
    include("includes/head.php");
?>

<!-- Content -->
<div class="content">
    <h2>Admin</h2>
    <hr>
    <!-- Page Content -->
    <h3>Edit Matches</h3>
    <form id="updateMatch" method="POST" action="includes/tournamentUpdate.php">
        <table id="adminTable" class="borderTable">
            <caption>This shows all of the games in the tournament.</caption>
            <thead>
            <tr>
                <th>#</th>
                <th scope="col" colspan="2">Team 1</th>
                <th scope="col" colspan="2">Team 2</th>
                <th scope="col">Venue</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
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
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div id="form_output"></div>

        <!-- Conformation Model -->
        <div id="confirmationModal" class="modal">
            <!-- Modal Content -->
            <div class="modal-content">
                <div class="modal-header">
                    <span id="confirmationClose" class="modalClose">×</span>
                    <h3>Match Change Confirmation</h3>
                </div>
                <div class="modal-body" id="confirmationBody">

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
    $scriptList = ['admin.js', 'adminValidate.js', 'adminSubmit.js'];
    include("includes/foot.php");
?>