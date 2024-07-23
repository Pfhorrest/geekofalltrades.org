<?php $title = "1st of January 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>1st of January 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Snowy Topa Topa from Upper Ojai"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0141.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0141-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>
					<li>
						<h3><?php $caption = "Santa Paula Creek near Thomas Aquinas College"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0132.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0132-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>
					<li>
						<h3><?php $caption = "Candelabra aloe at Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0130.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0130-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>
					<li>
						<h3><?php $caption = "Blue potato bush at Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0128.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0128-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>
					<li>
						<h3><?php $caption = "Lily of the Incas at Krotona"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0126.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0126-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>
					<li>
						<h3><?php $caption = "Snowy Topa Topa from Ojai Meadows Preserve"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/01/IMG_0121.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0121-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-01.</p>
					</li>

				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>