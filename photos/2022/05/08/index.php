<?php $title = "8th of May 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>8th of May 2022 Photography</h2>
	<p class="description">Best of the day</p>
	<?php
		$images = array(
			array(
				'title' => 'Blue daisies at Ventura Botanic Garden',
				'filename' => 'IMG_4029.JPG',
				'description' => 'iPhone 7, 2022-05-08.',
			),
			array(
				'title' => 'Many protea at Ventura Botanic Garden',
				'filename' => 'IMG_4023.JPG',
				'description' => 'iPhone 7, 2022-05-08.',
			),
			array(
				'title' => 'Protea at Ventura Botanic Garden',
				'filename' => 'IMG_4022.JPG',
				'description' => 'iPhone 7, 2022-05-08.',
			),
			array(
				'title' => 'Sticky monkey flowers at Arroyo Verde',
				'filename' => 'IMG_4017.JPG',
				'description' => 'iPhone 7, 2022-05-08.',
			),
			array(
				'title' => 'Three bugs and a morning glory at Arroyo Verde',
				'filename' => 'IMG_4016.JPG',
				'description' => 'iPhone 7, 2022-05-08.',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>