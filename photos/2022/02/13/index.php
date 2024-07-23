<?php $title = "13th of February 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>13th of February 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "African daisies near Taormina"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/13/IMG_0920.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0920-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-13.</p>
					</li>
					<li>
						<h3><?php $caption = "Black-eyed Susan near Taormina"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/13/IMG_0917.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0917-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-13.</p>
					</li>
					<li>
						<h3><?php $caption = "Moon over pencil cypress near Taormina"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/13/IMG_0915.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0915-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-13.</p>
					</li>
					<li>
						<h3><?php $caption = "Treasure flowers near Taormina"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/02/13/IMG_0912.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0912-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-02-13.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>