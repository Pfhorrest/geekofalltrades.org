<?php $title = "21st of February 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>21st of February 2022 Photography</h2>
	<p class="description">Best of the day</p>
	<?php
		$images = array(
			array(
				'title' => 'Oaks, sky, and Spanish tile at Krotona',
				'filename' => 'IMG_1268.JPG',
				'description' => 'iPhone 7, 2022-02-21.',
			),
			array(
				'title' => 'Yellow oxalis in a yard behind Krotona',
				'filename' => 'IMG_1257.JPG',
				'description' => 'iPhone 7, 2022-02-21.',
			),
			array(
				'title' => 'Cloudy skies above Krotona',
				'filename' => 'IMG_1253.JPG',
				'description' => 'iPhone 7, 2022-02-21.',
			),
			array(
				'title' => 'Pink geranium at Krotona',
				'filename' => 'IMG_1246.JPG',
				'description' => 'iPhone 7, 2022-02-21.',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>