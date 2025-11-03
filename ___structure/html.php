<?php
	/**  
	 * The core of the PrevHP system, that loops through every subdirectory to
	 * the requested URL and loads any styles, scripts, and meta-data found in
	 * each of them, plus main body content from the last of them.
	 * Also handles special cases like requests for non-systematic HTML or PHP
	 * files, requests for lightboxed images via the "display" parameter,
	 * directory listings, and errors.
	 * 
	*/


	/**  
	 * Internal path to the root directory of the site on the server.
	 * 
	 * @var string
	*/
	$root = (php_sapi_name() === 'cli-server')
		// Running under PHP built-in server
		 ? realpath(__DIR__ . '/../') // Project root
		// Running under Apache / production
		: $root = $_SERVER['DOCUMENT_ROOT'];

	/**  
	 * External path of the requested document relative to the host.
	 * 
	 * @var string
	*/
	$path = array_filter(explode("?",$_SERVER['REQUEST_URI']))[0];

	/**  
	 * Internal path to the requested document on the server.
	 * 
	 * @var string
	 * @uses $root to build the full path
	 * @uses $path to build the full path
	*/
	$rootpath = $root.$path;

	/**  
	 * Segments of the external request path, directory-by-directory.
	 * 
	 * @var array
	 * @uses $path to generate the array.
	*/
	$segments = array_filter(explode("/",$path));

	/**  
	 * External paths up to each of those segments ("breadcrumbs"),
	 * initialized with the bare root of the host ("/").
	 * 
	 * @var array
	 * @uses $segments
	 * @uses $root
	*/
	$crumbs = ["/"];
	foreach ($segments as $segment) {
		/* Take the last crumb and append the next segment to it. */
		$this_crumb = $crumbs[array_key_last($crumbs)] . $segment;
		/* Add that combo as the next crumb, plus a "/" for directories. */
		$crumbs[] = $this_crumb . (is_dir($root.$this_crumb) ? "/" : "");
	}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once("modules/analytics.php") ?>
		<?php include_once("modules/color-scheme.php") ?>
		<?php
			foreach ($crumbs as $crumb) {
				/* Relative path to the styles file from the crumb root */
				$stylepath = $crumb . "__styles/styles.css" ;
				/* Absolute path to the styles file on the server */
				$stylefile = $root . $stylepath;
				if (is_file($stylefile)) {
					/* Put modified date of styles file in link href
					   to prevent excessive cacheing */
					$styledated = $stylepath . '?v=' . filemtime($stylefile);
					/* Preload the styles file to prevent
					   a flash of unstyled content */
					echo '<link href="' . $styledated . '" 
							rel="preload" as="style" />'
							.
							'<link href="' . $styledated . '" 
							rel="stylesheet" />';
				}

				/* Relative path to the scripts file from the crumb root */
				$scriptpath = $crumb . "__scripts/scripts.js";
				/* Absolute path to the scripts file on the server */
				$scriptfile = $root . $scriptpath ;
				if (is_file($scriptfile)) {
					/* Put modified date of scripts file in script src
					   to prevent excessive cacheing */
					$scriptdated = $scriptpath . '?v=' . filemtime($scriptfile);
					echo '<script src="' . $scriptdated . '"
						type="module"></script>' ;
				}

				/* Absolute path to the head file (for meta-data) on the server */
				$headpath = $root . $crumb . "__head.php";
				if (is_file($headpath)) {
					include $headpath;
				}
			}
		?>
		<!--  Set title to whatever the deepest head file declared -->
		<title>
			<?php
			$title = $_GET['title'] ?? ($title ?? "Untitled");
			echo $title . " by Forrest Cameranesi";
			?>
		</title>
		<!--  Set description to whatever the deepest head file declared -->
		<meta name="description" content="<?php echo htmlspecialchars($description ?? '', ENT_QUOTES); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<?php
			/* Set favicons of different sizes programmatically */
			$favicon_sizes = [16, 32, 96, 180];
			foreach ($favicon_sizes as $size) {
				echo '<link rel="icon" type="image/png"
					href="/_media/images/favicons/favicon-'.$size.'.png"
					sizes="'.$size.'x'.$size.'" />';
			}
		?>
	</head>
	<body>
		<header>
			<?php
				/* Include all available header files from deep to shallow */
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
				/**  
				 * Internal path to the main content of the requested document
				 * on the server.
				 * 
				 * @var string
				*/
				$mainpath = $rootpath . "__main.php";
				if (is_file($mainpath)) {
					/* If there is such a thing, include it */
					include $mainpath;
					/* If there is a 'display' parameter,
						include the lightbox too */
					if ($display = $_GET["display"]) {
						include "modules/lightbox.php";
					}
				} elseif (is_dir($rootpath)) {
					/* If the requested directory has an index.php,
						just redirect to that */
					if (is_file($rootpath . "index.php")) {
						header("Location: $requestUri/index.php");
						exit;
					}
					/* Or else if it has an index.html,
						just redirect to that instead */
					elseif (is_file($rootpath . "index.html")) {
						header("Location: $requestUri/index.html");
						exit;
					}
					/* Otherwise just show a directory listing */
					elseif ($indexes) {
						include "modules/directory.php";
					}
				}
				/* If all else fails, show an error */
				else {
					include "modules/error.php";
				}
			?>
		</main>
		<footer>
			<?php
				/* Include all available footer files from shallow to deep */
				foreach (array_reverse($crumbs) as $crumb) {
					$footerpath = $root . $crumb . "__footer.php";
					if (is_file($footerpath)) {
						include $footerpath;
					}
				}
			?>
		</footer>
	</body>
</html>
