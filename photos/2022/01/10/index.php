<?php $title = "1st of January 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>1st of January 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Red hibiscus on Park Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/10/IMG_0226.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0226-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-10.</p>
					</li>
					<li>
						<h3><?php $caption = "Another peachy garden rose on Park Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/10/IMG_0224.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0224-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-10.</p>
					</li>
					<li>
						<h3><?php $caption = "Peachy garden rose on Park Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/10/IMG_0223.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0223-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-10.</p>
					</li>
					<li>
						<h3><?php $caption = "Pink garden rose on Park Road"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/01/10/IMG_0221.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_0221-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-01-10.</p>
					</li>

				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>