<!DOCTYPE html>

<html lang="en">

	<head>
		<?php include_once($_SERVER['DOCUMENT_ROOT'] . "/analyticstracking.php") ?>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<?php
			$cssfilename = "/styles/css/styles.css" ;
			$csspath = $_SERVER['DOCUMENT_ROOT'] . $cssfilename ;
			if (file_exists($csspath)) {
				$cssdate = filemtime ($csspath) ;
			}
			echo '<link rel="stylesheet" media="all" href="' . $cssfilename . '?v=' . $cssdate . '" />' ;

			$jsfilename = "/scripts.js" ;
			$jspath = $_SERVER['DOCUMENT_ROOT'] . $jsfilename ;
			if (file_exists($jspath)) {
				$jsdate = filemtime ($jspath) ;
			}
			echo '<script src="' . $jsfilename . '?v=' . $jsdate . '" defer="true"></script>' ;
			$segments = array_filter(explode("/",$_SERVER['REQUEST_URI']));
		?>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<?php
			$paths = ["/"];
			foreach ($segments as $segment) {
				$paths[] = $paths[array_key_last($paths)] . $segment . "/";
			}

			$page_description = $description;
			foreach ($paths as $path) {
				include $_SERVER['DOCUMENT_ROOT'] . $path . "description.php";
			}
			if ($page_description) {
				$description = $page_description;
			}
		?>
		<meta name="description" content="<?php echo $description ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" type="image/png" href="/favicon-196.png" />
		<title><?php echo $title ; ?></title>
	</head>

	<body>
		<header>
			<h1>
				<span>Forrest Cameranesi</span>
				<span>
					G<span>eek</span>
					o<span>f</span>
					a<span>ll</span>
					T<span>rades</span>
				</span>
			</h1>

			<nav id="menu">

			<?php
				foreach ($paths as $path) {
					$navpath = $_SERVER['DOCUMENT_ROOT'] . $path . "nav.";
					$navfile = $navpath . "php";
					if (is_file($navfile)) {
						include $navfile;
					} else {
						include $navpath . "html";
					}
				}
			?>

			</nav>
		</header>
		<main>