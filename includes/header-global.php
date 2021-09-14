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
			echo '<link rel="stylesheet" href="' . $cssfilename . '?v=' . $cssdate . '" />' ;

			$jsfilename = "/scripts.js" ;
			$jspath = $_SERVER['DOCUMENT_ROOT'] . $jsfilename ;
			if (file_exists($jspath)) {
				$jsdate = filemtime ($jspath) ;
			}
			echo '<script src="' . $jsfilename . '?v=' . $jsdate . '" defer="true" /></script>' ;
		?>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="description" content="Forrest Cameranesi is a &quot;Geek of all Trades&quot; &ndash; a web developer, graphic designer, philosopher, science-fantasy writer, retro game modder, and nature photographer &ndash; from Ojai, California." />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" type="image/png" href="/favicon-196.png" />
		<title><? echo $title ; ?></title>
	</head>

	<body>
		
			<header>
				<a href="/"><h1>Forrest Cameranesi <span class="logo">&ndash;</span> <span>Geek of all Trades</span></h1></a>
			</header>