<?php $title = "2014 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>2014 Photography</h2>
	<p class="description">Best of the year</p>
	<?php
		$images = array(
			array(
				'title' => 'The Pink Moment from Jefferson Ridge Loop',
				'filename' => '10/IMG_1223.JPG',
				'description' => 'iPhone 4, 2014-10-30.'
			),
			array(
				'title' => 'The Huntington Chinese Garden',
				'filename' => '10/IMG_1110.JPG',
				'description' => 'iPhone 4, 2014-10-05.'
			),
	
			array(
				'title' => 'Zebra longwing at SBMNH',
				'filename' => '06/IMG_0503.JPG',
				'description' => 'iPhone 4, 2014-06-15.'
			),
	
			array(
				'title' => 'Montezuma Castle National Monument',
				'filename' => '04/IMG_2995.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-23.'
			),
			array(
				'title' => 'Red mesa over Sedona',
				'filename' => '04/IMG_2908.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-22.'
			),
			array(
				'title' => 'Painted Desert Inn',
				'filename' => '04/IMG_2840.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-21.'
			),
			array(
				'title' => 'Petrified Forest National Park',
				'filename' => '04/IMG_2742.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-21.'
			),
			array(
				'title' => 'The Grand Canyon from Ooh Aah Point',
				'filename' => '04/IMG_2611.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-20.'
			),
			array(
				'title' => 'Desert View Watchtower at The Grand Canyon',
				'filename' => '04/IMG_2477.JPG',
				'description' => 'Canon PowerShot A530, 2014-04-20.'
			),
	
			array(
				'title' => 'Sycamores in Ojai skies on the vernal equinox',
				'filename' => '03/IMG_2439.JPG',
				'description' => 'Canon PowerShot A530, 2014-03-20.'
			),
	
			array(
				'title' => 'Giraffes at the Santa Barbara Zoo',
				'filename' => '01/IMG_0316.jpg',
				'description' => 'iPhone 4, 2014-01-20.'
			),
			array(
				'title' => 'Santa Cruz Island from near Rose Valley',
				'filename' => '01/IMG_2068.JPG',
				'description' => 'Canon PowerShot A530, 2014-01-01.'
			),
			);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>