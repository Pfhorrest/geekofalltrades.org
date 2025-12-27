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

	/* Bootstrap modules */
	require_once __DIR__ . '/modules/_bootstrap.php';

	/* Prevent caching of any pages */
	header("Cache-Control: no-cache, must-revalidate");

	/**  
	 * Internal path to the root directory of the site on the server.
	 * 
	 * @var string
	*/

	/* Determine root based on SAPI */
	$root = root_determination(
		php_sapi_name(),
		$_SERVER['DOCUMENT_ROOT'] ?? '',
		__DIR__
	);

	/**  
	 * External path of the requested document relative to the host.
	 * 
	 * @var string
	*/
	$path = path_from_url($_SERVER['REQUEST_URI']);

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
	$segments = segments_from_path($path);

	/**  
	 * External paths up to each of those segments ("breadcrumbs"),
	 * initialized with the bare root of the host ("/").
	 * 
	 * @var array
	 * @uses $segments
	*/
	$crumbs = crumbs_from_segments($segments);

	/* Import site-wide config variables */
	include_once("config.php")
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once("modules/analytics.html") ?>
		<?php include_once("modules/preferences.html") ?>
		<?php
			$head = [];
			foreach ($crumbs as $crumb) {
				/* Render styles for each crumb */
				echo render_styles_for_crumb($root, $crumb);
				/* Render scripts for each crumb */
				echo render_scripts_for_crumb($root, $crumb);
				/* Include head files for each crumb if they exist */
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
		<meta name="description" content="<?php echo htmlspecialchars($head['description'] ?? '', ENT_QUOTES); ?>" />
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
				/* Determine main action for this request */
				$action = main_resolution($rootpath, $meta['indexes'] ?? false);

				switch ($action['type']) {
					/* Main content inclusion */
					case 'main':
						include $rootpath . '__main.php';
						/* Lightbox inclusion if requested */
						if (lightbox_should_display($_GET)) {
							include 'modules/lightbox.php';
						}
						break;

					case 'redirect':
						/* Redirect to index file */
						header("Location: $requestUri/" . $action['target']);
						exit;

					case 'directory':
						/* Directory listing */
						include 'modules/directory.php';
						break;

					case 'error':
						/* Error page */
						include 'modules/error.php';
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
						include $footerpath;
					}
				}
			?>
		</footer>
	</body>
</html>
