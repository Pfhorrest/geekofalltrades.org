<?php
	$root = $_SERVER['DOCUMENT_ROOT'];
	$queryless = array_filter(explode("?",$_SERVER['REQUEST_URI']))[0];
	$segments = array_filter(explode("/",$queryless));
	$crumbs = ["/"];
	foreach ($segments as $segment) {
		$this_crumb = $crumbs[array_key_last($crumbs)] . $segment;
		$crumbs[] = $this_crumb . (is_dir($root.$this_crumb) ? "/" : "");
	}
	$path = $crumbs[array_key_last($crumbs)];
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once($root . "/analyticstracking.php") ?>
		<script
			src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js">
		</script>
		<?php
			foreach ($crumbs as $crumb) {
				$stylepath = $crumb . "__styles/styles.css" ;
				$stylefile = $root . $stylepath;
				if (is_file($stylefile)) {
					$styledate = filemtime($stylefile) ;
					echo '<link href="' . $stylepath . '?v=' . $styledate . '" 
							rel="stylesheet" media="all" />' ;
				}

				$scriptpath = $crumb . "__scripts.js" ;
				$scriptfile = $root . $scriptpath ;
				if (is_file($scriptfile)) {
					$scriptdate = filemtime($scriptfile) ;
					echo '<script src="' . $scriptpath . '?v=' . $scriptdate . '"
							defer="true"></script>' ;
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
				$mainpath = $root . $path . "__main.php";
				if (is_file($mainpath)) {
					include $mainpath;
					if ($display = $_GET["display"]) {
						include $root . "/___prevhp/modal.php";
					}
				} elseif (is_dir($root.$path)) {
					include $root . "/___prevhp/directory.php";
				} else {
					include $root . "/___prevhp/error.php";
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