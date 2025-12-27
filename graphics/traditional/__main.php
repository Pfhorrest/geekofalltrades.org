<section>
	<h2>Traditional Arts</h2>
	<p class="description">Examples of more traditional art, in assorted media.</p>
	<?php
		echo render_gallery($images = array(
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
		));
	?>
</section>
