<?php $title = "23rd of April 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>23rd of April 2022 Photography</h2>
	<p class="description">Best of the day</p>
	<?php
		$images = array(
			array(
				'title' => 'Windmills near Upolu Point',
				'filename' => 'IMG_3838.JPG',
				'description' => 'iPhone 7, 2022-04-23.',
			),
			array(
				'title' => 'Upolu Point, the utmost north of Hawai\'i',
				'filename' => 'IMG_3828.JPG',
				'description' => 'iPhone 7, 2022-04-23.',
			),
			array(
				'title' => 'Butter daisies at Waipi\'o Valley Lookout',
				'filename' => 'IMG_3778.JPG',
				'description' => 'iPhone 7, 2022-04-23.',
			),
			array(
				'title' => 'Waipi\'o Valley',
				'filename' => 'IMG_3771.JPG',
				'description' => 'iPhone 7, 2022-04-23.',
			),
			array(
				'title' => 'White hibiscuses outside Hulahe\'e Palace',
				'filename' => 'IMG_3718.JPG',
				'description' => 'iPhone 7, 2022-04-23.',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>