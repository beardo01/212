<!DOCTYPE html>
<html lang="en">
    <?php
        //An associative array holding page names as the key and page link as the value
        $pages = ['Home' => 'index.php', 'Fixtures' => 'fixtures.php', 'Admin' => 'admin.php', 'Create' => 'create.php'];
    ?>
    <head>
        <meta charset="UTF-8">
        <title>World Scores - <?= array_search(basename($_SERVER['PHP_SELF']), $pages); ?></title>

        <!-- Import Fonts and Icons -->
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css">

        <!-- Set Favicon -->
        <link rel="icon" href="images/favicon.ico">

        <!-- Import Styles -->
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">

        <!-- Import Important Javascript -->
        <script src="vendor/jquery/jquery-3.1.0.min.js"></script>
        <script src="js/xml.js"></script>
        <script src="js/global.js"></script>

        <!-- Add this for increased screen size compatibility -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    <div id="main">
        <!-- Header -->
        <header>
            <div class="hcontent">
                <h1 id="title">UEFA Euro</h1>
                <nav>
                    <?php
                    //We build the navigation bar by checking if the link is the same as our current page and creating the HTML element accordingly
                    foreach ($pages as $title => $link) {
                        echo basename($_SERVER['PHP_SELF']) == $link ? '<span class="mlink active">' . $title . '</span>' : '<a class="mlink" href="' . str_replace(".php", "", $link) . '">' . $title . '</a>';
                    }
                    ?>
                </nav>
            </div>
        </header>
        <!-- /Header -->
