<?php $title = "22nd of May 2022 Photography by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>22nd of May 2022 Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Sunlit trail through Ellwood Mesa"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/05/22/IMG_4222.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_4222-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-05-22.</p>
					</li>
					<li>
						<h3><?php $caption = "Dandelion puff at Ellwood Mesa"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/05/22/IMG_4217.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_4217-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-05-22.</p>
					</li>
					<li>
						<h3><?php $caption = "The beach at Ellwood Mesa"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/05/22/IMG_4215.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_4215-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-05-22.</p>
					</li>
					<li>
						<h3><?php $caption = "My hands in a black disc at Santa Barbara Museum of Art"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/05/22/IMG_4148.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="IMG_4148-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-05-22.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>