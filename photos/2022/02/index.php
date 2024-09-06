<?php $title = "February 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>
<section>
	<h2>February 2022 Photography</h2>
	<p class="description">Best of the month</p>
	<?php
		$images = array(
			array(
				'title' => 'Pink rose and oaks near Krotona',
				'filename' => '28/IMG_1412.JPG',
				'description' => 'iPhone 7, 2022-02-28.',
			),
			array(
				'title' => 'The Pink Moment from Lake Casitas',
				'filename' => '27/IMG_1391.JPG',
				'description' => 'iPhone 7, 2022-02-27.',
			),
			array(
				'title' => 'African daisies near Taormina',
				'filename' => '27/IMG_1372.JPG',
				'description' => 'iPhone 7, 2022-02-27.',
			),
			array(
				'title' => 'Ducks and clouds at Ojai Meadows',
				'filename' => '23/IMG_1328.JPG',
				'description' => 'iPhone 7, 2022-02-23.',
			),
			array(
				'title' => 'Cloudy skies over Shelf Road',
				'filename' => '23/IMG_1313.JPG',
				'description' => 'iPhone 7, 2022-02-23.',
			),
			array(
				'title' => 'Cloudy skies above Krotona',
				'filename' => '21/IMG_1253.JPG',
				'description' => 'iPhone 7, 2022-02-21.',
				'morelink' => '21',
				'moretext' => 'More from the 21st',
			),
			array(
				'title' => 'Last sunlight on Topa Topa from Ojai Meadows',
				'filename' => '19/IMG_1219.JPG',
				'description' => 'iPhone 7, 2022-02-19.',
			),
			array(
				'title' => 'Chief\'s Peak and Topa Topa from Ojai Meadows',
				'filename' => '18/IMG_1189.JPG',
				'description' => 'iPhone 7, 2022-02-18.',
			),
			array(
				'title' => 'Fairy iris amongst yellow oxalis',
				'filename' => '15/IMG_1041.JPG',
				'description' => 'iPhone 7, 2022-02-15.',
				'morelink' => '15',
				'moretext' => 'More from the 15th',
			),
			array(
				'title' => 'Mirrored moonrise at Ojai Meadows',
				'filename' => '14/IMG_1010.JPG',
				'description' => 'iPhone 7, 2022-02-14.',
				'morelink' => '14',
				'moretext' => 'More from the 14th',
			),
			array(
				'title' => 'African daisies near Taormina',
				'filename' => '13/IMG_0920.JPG',
				'description' => 'iPhone 7, 2022-02-13.',
			),
			array(
				'title' => 'Black-eyed Susan near Taormina',
				'filename' => '13/IMG_0917.JPG',
				'description' => 'iPhone 7, 2022-02-13.',
			),
			array(
				'title' => 'Sun-lit hibiscus and palms at Alice Keck Park',
				'filename' => '12/IMG_0663.JPG',
				'description' => 'iPhone 7, 2022-02-12.',
				'morelink' => '12',
				'moretext' => 'More from the 12th',
			),
			array(
				'title' => 'Moonrise and owls at Ojai Meadows',
				'filename' => '11/IMG_0593.JPG',
				'description' => 'iPhone 7, 2022-02-11.',
			),
			array(
				'title' => 'Bee on African Daisies at Krotona',
				'filename' => '07/IMG_0484.JPG',
				'description' => 'iPhone 7, 2022-02-07.',
				'morelink' => '07',
				'moretext' => 'More from the 7th',
			),
		);
		require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
	?>
</section>				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>