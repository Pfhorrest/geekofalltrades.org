<?php $title = "7th of June 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>7th of June 2022 Photography</h2>
	<p class="description">Best of the day</p>
	<?php
		$images = array(
			array(
				'title' => 'The sunken highway reemerged from Lake Casitas',
				'filename' => 'IMG_4442.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'The far side of Lake Casitas',
				'filename' => 'IMG_4439.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Looking out from the peninsula that should not be in Lake Casitas',
				'filename' => 'IMG_4437.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Far side of the peninsula that should not be in Lake Casitas',
				'filename' => 'IMG_4433.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Thistle near the deep end of Lake Casitas',
				'filename' => 'IMG_4429.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Into the deep end of Lake Casitas',
				'filename' => 'IMG_4414.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Old lake bottom revegetated in Lake Casitas',
				'filename' => 'IMG_4407.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
			array(
				'title' => 'Looking back from the peninsula that should not be in Lake Casitas',
				'filename' => 'IMG_4401.JPG',
				'description' => 'iPhone 7, 2022-06-07.',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>