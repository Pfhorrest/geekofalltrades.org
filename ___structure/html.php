<?php
	// declare(strict_types=1);
	$root = $_SERVER['DOCUMENT_ROOT'];
	$path = array_filter(explode("?",$_SERVER['REQUEST_URI']))[0];
	$rootpath = $root.$path;
	$segments = array_filter(explode("/",$path));
	$crumbs = ["/"];
	foreach ($segments as $segment) {
		$this_crumb = $crumbs[array_key_last($crumbs)] . $segment;
		$crumbs[] = $this_crumb . (is_dir($root.$this_crumb) ? "/" : "");
	}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once("analyticstracking.php") ?>
		<?php
				// echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
				// <script>
				// 	require([\'__scripts/scripts-intermediate\'], function(scripts) {
				// 		console.log(\'Main module and dependencies loaded.\');
				// 	}, function(err) {
				// 		console.error(\'Failed to load the main module:\', err);
				// 	});
				// </script>';

				// echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" data-main="__scripts/scripts-intermediate.js" defer="true"></script>';

				foreach ($crumbs as $crumb) {
				$stylepath = $crumb . "__styles/styles.css" ;
				$stylefile = $root . $stylepath;
				if (is_file($stylefile)) {
					$styledate = filemtime($stylefile) ;
					echo '<link href="' . $stylepath . '?v=' . $styledate . '" 
							rel="preload" as="style" onload="this.rel=\'stylesheet\'" />';
				}

				$scriptpath = $crumb . "__scripts/scripts.js";
				$scriptfile = $root . $scriptpath ;
				if (is_file($scriptfile)) {
					$scriptdate = filemtime($scriptfile) ;
					echo '<script src="' . $scriptpath . '?v=' . $scriptdate . '"
							defer="true" type="module"></script>' ;
				}

				$headpath = $root . $crumb . "__head.php";
				if (is_file($headpath)) {
					include $headpath;
				}
			}
		?>
		<title>
			<?php
				if ($_GET["title"]) {
					$title = $_GET["title"] . " by Forrest Cameranesi";
				}
				echo $title;
			?>
		</title>
		<meta name="description" content="<?php echo $description ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<?php
			$favicon_sizes = [16, 32, 96, 180];
			foreach ($favicon_sizes as $size) {
				echo '<link rel="icon" type="image/png"
					href="/__images/favicons/favicon-'.$size.'.png"
					sizes="'.$size.'x'.$size.'" />';
			}
		?>
		<script>
			/* to prevent Firefox FOUC */
			let FF_FOUC_FIX;
		</script>
  	</head>
	<body>
		<header>
			<?php
				foreach ($crumbs as $crumb) {
					$headerpath = $root . $crumb . "__header.php";
					if (is_file($headerpath)) {
						include $headerpath;
					}
				}
			?>
		</header>
		<main>
			<?php
				$dirpath = $root . $path;
				$mainpath = $dirpath . "__main.php";
				switch (true) {
					case is_file($mainpath):
						include $mainpath;
						if ($display = $_GET["display"]) {
							include "modules/lightbox.php";
						}
						break;
					case is_dir($dirpath):
						if (is_file($dirpath . "index.php")) {
							echo '<meta http-equiv="refresh"
								content="0;url='.$queryless.'index.php">';
							break;
						} elseif (is_file($dirpath . "index.html")) {
							echo '<meta http-equiv="refresh"
								content="0;url='.$queryless.'index.html">';
							break;
						} elseif ($indexes) {
							include "modules/directory.php";
							break;
						}
					default:
						include "modules/error.php";
				}
			?>
		</main>
		<footer>
			<?php
				foreach ($crumbs as $crumb) {
					$footerpath = $root . $crumb . "__footer.php";
					if (is_file($footerpath)) {
						include $footerpath;
					}
				}
			?>
		</footer>
	</body>
</html>
