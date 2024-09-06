<?php $title = "16th of April 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>16th of April 2022 Photography</h2>
	<p class="description">Best of the day</p>
	<?php
		$images = array(
			array(
				'title' => 'Twilight on Kukailimoku Point from Royal Kona Resort',
				'filename' => 'IMG_2361.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Wawaloli beach and Makako Bay Dr',
				'filename' => 'IMG_2343.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Rabi\'s Reef and O\'oma beach',
				'filename' => 'IMG_2341.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Shores of Hawaii from the sky',
				'filename' => 'IMG_2323.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => '...like two ships passing in the sky',
				'filename' => 'IMG_2306.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Waves of clouds over the Pacific',
				'filename' => 'IMG_2285.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Santa Cruz and Santa Rosa islands from the sky',
				'filename' => 'IMG_2269.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
			array(
				'title' => 'Cloudy Santa Cruz island from the sky',
				'filename' => 'IMG_2256.JPG',
				'description' => 'iPhone 7, 2022-04-16.',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>