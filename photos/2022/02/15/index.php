<?php $title = "15th of February 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>15th of February 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Moonrise with ducks from Ojai Meadows"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/15/IMG_1095.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1095-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-15.</p>
					</li>
					<li>
						<h3><?php $caption = "Wild mustard at sunset near Ojai Meadows"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/15/IMG_1044.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1044-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-15.</p>
					</li>
					<li>
						<h3><?php $caption = "Fairy iris amongst yellow oxalis"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/15/IMG_1041.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1041-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-15.</p>
					</li>
					<li>
						<h3><?php $caption = "Cliff and sky over Shelf Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/15/IMG_1038.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1038-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-15.</p>
					</li>
					<li>
						<h3><?php $caption = "Fountain grass on Shelf Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/15/IMG_1027.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_1027-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-15.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>