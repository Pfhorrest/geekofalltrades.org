<?php $title = "Traditional Arts by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>Traditional Arts</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Pen Tree"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/pentree_finished.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/pentree_finished-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Ballpoint pen plus Photoshop coloring and shading, 2004.</p>
					</li>
					<li>
						<h3><?php $caption = "Surf Lens"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/SurfLensScreen.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/SurfLens-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Pencil, 2004.</p>
					</li>
					<li>
						<h3><?php $caption = "Charcoal Skull"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/CharcoalSkullScreen.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/CharcoalSkull-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Charcoal and conte crayon, 2004.</p>
					</li>
					<li>
						<h3><?php $caption = "Radiant Ink"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/RadiantInkScreen.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/RadiantInk-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>India ink pen, 2002.</p>
					</li>
					<li>
						<h3><?php $caption = "Irradiant Ink"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/IrradiantInkScreen.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/IrradiantInk-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>India ink pen, 2002.</p>
					</li>
				</ul>

<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
