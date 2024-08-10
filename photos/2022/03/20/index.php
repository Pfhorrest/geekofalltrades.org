<?php $title = "20th of March 2022 Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>20th of March 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Young wheatgrass and oak sapling at Ojai Meadows"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/03/21/IMG_1946.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1946-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-03-21.</p>
					</li>
					<li>
						<h3><?php $caption = "Hong Kong orchid tree on Pleasant Avenue"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/03/20/IMG_1938.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1938-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-03-20.</p>
					</li>
					<li>
						<h3><?php $caption = "California poppies near Pleasant Avenue"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/03/20/IMG_1934.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1934-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-03-20.</p>
					</li>
					<li>
						<h3><?php $caption = "California poppies on Mercer Avenue"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/03/20/IMG_1933.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1933-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-03-20.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>