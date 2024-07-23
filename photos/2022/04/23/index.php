<?php $title = "23rd of April 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>23rd of April 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Windmills near Upolu Point"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3838.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_3838-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
					</li>
					<li>
						<h3><?php $caption = "Upolu Point, the utmost north of Hawai'i"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3828.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_3828-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
					</li>
					<li>
						<h3><?php $caption = "Butter daisies at Waipi'o Valley Lookout"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3778.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_3778-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
					</li>
					<li>
						<h3><?php $caption = "Waipi'o Valley"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3771.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_3771-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
					</li>
					<li>
						<h3><?php $caption = "White hibiscuses outside Hulahe'e Palace"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3718.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_3718-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>