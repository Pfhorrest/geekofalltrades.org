<h1>
    <span>Forrest Cameranesi</span>
    <span>
        G<span>eek</span>
        o<span>f</span>
        a<span>ll</span>
        T<span>rades</span>
    </span>
</h1>
<nav>
    <?php
        foreach ($crumbs as $crumb) {
            $navpath = $root . $crumb . "__nav.php";
            if (is_file($navpath)) {
                include $navpath;
            }
        }
    ?>
</nav>
