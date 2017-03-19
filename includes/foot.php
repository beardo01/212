<!-- Footer -->
<footer>
    <p>This website was created for a University project. The content is largely fictional and no services are actually
        being offered.</p>
</footer>
<!-- /Footer -->

<!-- Import Other Javascript -->
<?php
    //Get the scripts required for this page. This may generate a waring that scriptList isn't defined, however it is defined in another file.
    foreach ($scriptList as $script) {
        echo '<script src="js/' . $script . '"></script>';
    }
?>
</div>
</body>
</html>