<?php

echo "<pre>";
echo "REQUEST_URI = " . ($_SERVER['REQUEST_URI'] ?? 'UNSET') . "\n";
echo "ROOTPATH    = " . ($GLOBALS['rootpath'] ?? 'UNSET') . "\n";
echo "CWD         = " . getcwd() . "\n";

$expected = rtrim($GLOBALS['rootpath'] ?? '', '/') . '/__main.php';
echo "__main.php exists? ";
var_dump(is_file($expected));
echo "</pre>";
exit;


	/**  
	 * The core of the PrevHP system, that loops through every subdirectory to
	 * the requested URL and loads any styles, scripts, and meta-data found in
	 * each of them, plus main body content from the last of them.
	 * Also handles special cases like requests for non-systematic HTML or PHP
	 * files, requests for lightboxed images via the "display" parameter,
	 * directory listings, and errors.
	 * 
	*/

	/* Bootstrap modules */
	require_once __DIR__ . '/modules/bootstrap.php';

	/* Prevent caching of any pages */
	header("Cache-Control: no-cache, must-revalidate");

	/**  
	 * Internal path to the root directory of the site on the server.
	 * 
	 * @var string $root
	*/
	$root = root_determination(
		php_sapi_name(),
		$_SERVER['DOCUMENT_ROOT'] ?? '',
		__DIR__
	);

	/**  
	 * External path of the requested document relative to the host.
	 * 
	 * @var string $path
	*/
	$path = path_from_url($_SERVER['REQUEST_URI']);

	/**  
	 * Internal path to the requested document on the server.
	 * 
	 * @var string $rootpath
	 * @uses $root to build the full path
	 * @uses $path to build the full path
	*/
	$rootpath = $root.$path;

	/**  
	 * Segments of the external request path, directory-by-directory.
	 * 
	 * @var array $segments
	 * @uses $path to generate the array.
	*/
	$segments = segments_from_path($path);

	/**  
	 * External paths up to each of those segments ("breadcrumbs"),
	 * initialized with the bare root of the host ("/").
	 * 
	 * @var array $crumbs
	 * @uses $segments
	*/
	$crumbs = crumbs_from_segments($segments);

	/* Import site-wide config variables */
	include_once("config.php")
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once("modules/views/partials/analytics.html") ?>
		<?php include_once("modules/views/partials/preferences.html") ?>
		<?php
			$head = [];
			foreach ($crumbs as $crumb) {
				/* Link styles for each crumb */
				echo styles_for_crumb($root, $crumb);
				/* Link scripts for each crumb */
				echo scripts_for_crumb($root, $crumb);
				/* Merge head data from each crumb */
				$head = array_merge($head, head_for_crumb($root, $crumb));
			}
		?>
		<!--  Set title -->
		<title>
			<?= title_resolution(
				$_SERVER['HTTP_HOST'],
				$segments,
				$head['title'] ?? '',
				$_GET,
				$site_tagline_suffix
			) ?>
		</title>
		<!--  Set description to whatever the deepest head file declared -->
		<meta name="description" content="<?php
			echo htmlspecialchars($head['description'] ?? '', ENT_QUOTES);
		?>" />
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
						include_once $headerpath;
					}
				}
			?>
		</header>
		<main>
			<?php
				/* Determine main action for this request */
				$action = main_resolution($rootpath, $head['indexes'] ?? false);

				switch ($action['type']) {
					/* Main content inclusion */
					case 'main':
						include_once $rootpath . '__main.php';
						/* Lightbox inclusion if requested */
						if (array_key_exists('display', $_GET)) {
							include_once 'modules/views/partials/lightbox.php';
						}
						break;

					case 'redirect':
						/* Redirect to index file */
						header("Location: $_SERVER[REQUEST_URI]/" . $action['target']);
						exit;

					case 'directory':
						/* Directory listing */
						include_once 'modules/views/partials/directory.php';
						break;

					case 'error':
						/* Error page */
						include_once 'modules/views/partials/error.php';
						break;
				}
			?>
		</main>
		<footer>
			<?php
				/* Include all available footer files from shallow to deep */
				foreach (array_reverse($crumbs) as $crumb) {
					$footerpath = $root . $crumb . "__footer.php";
					if (is_file($footerpath)) {
						include_once $footerpath;
					}
				}
			?>
		</footer>
	</body>
</html>
