<?php
	$root = $_SERVER['DOCUMENT_ROOT'];
	$segs = array_filter(explode("/",$_SERVER['REQUEST_URI']));
	$crumbs = ["/"];
	foreach ($segs as $seg) {
		$crumbs[] = $crumbs[array_key_last($crumbs)] . $seg
			. (is_dir(
				$_SERVER['DOCUMENT_ROOT'] . $crumbs[array_key_last($crumbs)] . $seg
			) ? "/" : "");
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
		<title><?php echo $title ?></title>
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
				} elseif (is_dir($root.$path)) {
					echo '<section>
						<h2>'.$path.'</h2>
						<p class="description">Directory Listing</p>
						<ul>';
						$files = scandir($root . $path);
						foreach ($files as $file) {
							echo '<li>
								<a href="'.$path.$file.'">'
								.$file.
								'</a>
							</li>';
						}
					echo '</ul>
					</section>';
				} else {
					echo '<section>
						<h2>File Not Found</h2>
						<p class="description">No such file as '.$path.'</p>
					</section>';
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