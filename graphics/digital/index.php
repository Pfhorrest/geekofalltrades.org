<?php $title = "Digital Arts by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

			<section>
				<h2>Digital Arts</h2>

				<p class="description">Examples of my other design for screen.</p>
			
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery expansive">

					<li>
						<h3><?php $caption = "Sample project for <i>DSG</i>"; echo $caption ?></h3>
						<?php echo '<a href="' . $basepath . 'images/dsg-anim.mp4' . '" rel="external">
							<img src="images/dsg-anim.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2021.</p>
					</li>
					<li>
						<h3><?php $caption = "Sample project for <i>Keyper</i>"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/keyper-camping-composition.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/keyper-camping-composition-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2021.</p>
					</li>
					<li>
						<h3><?php $caption = "Sample project for <i>LearningsFun</i>"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/learningsfun-v2.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/learningsfun-v2-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2020.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Leafy Greens</i> ad mockup"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/leafy-greens.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/leafy-greens-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2020.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>MMNAT</i> route map"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/mmnat-route-map-2011.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/mmnat-route-map-2011-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "Pseudo Self Portrait"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/PseudoSelfPortrait.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/PseudoSelfPortrait-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2009.</p>
					</li>
					<li>
						<h3><?php $caption = "2007 Valentine"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/Valentine2007Composite.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/Valentine2007Composite-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator and Photoshop, 2007.</p>
					</li>
					<li>
						<h3><?php $caption = "Palm tree"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/Palm.gif&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/Palm-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2006.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Earthset</i> desktop"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/earthset.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/earthset-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2006.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Fairy Princess</i> desktop"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/kayla.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/kayla-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2004.</p>
					</li>
				</ul>
			</section>				

			<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
