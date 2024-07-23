<?php $title = "21st of February 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>21st of February 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Oaks, sky, and Spanish tile at Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/21/IMG_1268.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1268-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-21.</p>
					</li>
					<li>
						<h3><?php $caption = "Yellow oxalis in a yard behind Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/21/IMG_1257.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1257-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-21.</p>
					</li>
					<li>
						<h3><?php $caption = "Cloudy skies above Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/21/IMG_1253.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1253-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-21.</p>
					</li>
					<li>
						<h3><?php $caption = "Pink geranium at Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/21/IMG_1246.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1246-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-21.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>