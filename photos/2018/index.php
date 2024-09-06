<?php $title = "2018 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>2018 Photography</h2>
	<p class="description">Best of the year</p>
	<?php
		$images = array(
			array(
				'title' => 'The Korean Friendship Bell at Point Fermin',
				'filename' => '11/IMG_3329.JPG',
				'description' => 'iPhone 5s, 2018-11-25.'
			),
			array(
				'title' => 'The Japanese Friendship Garden at Balboa Park',
				'filename' => '11/IMG_3247.JPG',
				'description' => 'iPhone 5s, 2018-11-24.'
			),
			array(
				'title' => 'Moon bridge at The Huntington',
				'filename' => '10/IMG_2206.JPG',
				'description' => 'iPhone SE, 2018-10-06.'
			),
			array(
				'title' => 'Scarlet macaw at the Santa Barbara Zoo',
				'filename' => '09/IMG_2915.JPG',
				'description' => 'iPhone 5s, 2018-09-01.'
			),
			array(
				'title' => 'Snow leopard at the Santa Barbara Zoo',
				'filename' => '09/IMG_2065.JPG',
				'description' => 'iPhone SE, 2018-09-01.'
			),
			array(
				'title' => 'The pier at Hueneme Beach',
				'filename' => '07/IMG_2818.JPG',
				'description' => 'iPhone 5s, 2018-07-21.'
			),
			array(
				'title' => 'Gorilla at the Santa Barbara Zoo',
				'filename' => '05/IMG_1667.JPG',
				'description' => 'iPhone 5s, 2018-05-05.'
			),
			array(
				'title' => 'Beach at Tar Pits Park',
				'filename' => '04/IMG_1575.JPG',
				'description' => 'iPhone 5s, 2018-04-21.'
			),
			array(
				'title' => 'Garden rose on Arnaz Grade',
				'filename' => '04/IMG_1271.JPG',
				'description' => 'iPhone 5s, 2018-04-05.'
			),
	
			array(
				'title' => 'Tiny potted cactus etc at Descanso Gardens',
				'filename' => '03/IMG_1210.JPG',
				'description' => 'iPhone 5s, 2018-03-25.'
			),
			array(
				'title' => 'Dandelions at Soule Parke',
				'filename' => '03/IMG_0984.JPG',
				'description' => 'iPhone 5s, 2018-03-05.'
			),
			array(
				'title' => 'Thomas Fire aftermath above Pratt Trail',
				'filename' => '01/IMG_0467.JPG',
				'description' => 'iPhone 5s, 2018-01-03.'
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>