<?php $title = "Traditional Arts by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

			<section>
				<h2>Traditional Arts</h2>

				<p class="description">Examples of more traditional art, in assorted media.</p>
				
				<?php
					$images = array(
						array(
							'title' => 'Pen Tree',
							'filename' => 'pentree_finished.jpg',
							'description' => 'Ballpoint pen plus Photoshop coloring and shading, 2004.'
						),
						array(
							'title' => 'Surf Lens',
							'filename' => 'SurfLens.png',
							'description' => 'Pencil, 2004.'
						),
						array(
							'title' => 'Charcoal Skull',
							'filename' => 'CharcoalSkull.png',
							'description' => 'Charcoal and conte crayon, 2004.'
						),
						array(
							'title' => 'Radiant Ink',
							'filename' => 'RadiantInk.png',
							'description' => 'India ink pen, 2002.'
						),
						array(
							'title' => 'Irradiant Ink',
							'filename' => 'IrradiantInk.png',
							'description' => 'India ink pen, 2002.'
						),
					);
					require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
				?>

			</section>

<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
