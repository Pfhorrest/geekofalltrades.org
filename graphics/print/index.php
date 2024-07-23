<?php $title = "Print Design by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>Print Design</h2>

				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "My resume"; echo $caption ?></h3>
							<?php echo '<a href="images/resume.pdf" rel="external">
								<img src="images/resume-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator and Photoshop, 2020.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Monterey Company</i> sample card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/monterey_sample.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/monterey_sample-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2012.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Monterey Company</i> proof sheet"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/monterey_proof.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/monterey_proof-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2012.</p>
					</li>
					<li>
						<h3><?php $caption = "My business card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/forrest-card.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/forrest-card-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator and Photoshop, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "2011 <i>Concours d'Elegance</i> tickets"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2011Concours-tickets.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2011Concours-tickets-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Stratus Media Group</i> business card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/StratusBC-vertical.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/StratusBC-vertical-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Mille Miglia</i> poster"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010mille-poster-h6.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010mille-poster-h6.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Mille Miglia</i> poster"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010mille-poster-v1.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010mille-poster-v1.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2011.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Under The Magic Sky</i> album cover"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/magicsky.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/magicsky-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2010.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Concours d'Elegance</i> ticket"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010-concours-ticket-sunday.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010-concours-ticket-sunday.png" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2010.</p>
					</li>
					<li>
						<h3><?php $caption = "2010 <i>Mille Miglia Salute</i> route book"; echo $caption ?></h3>
							<?php echo '<a href="images/2010MilleSaluteRoute.pdf" rel="external">
								<img src="images/2010MilleSaluteRoute-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop and InDesign, 2010.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>24th Santa Barbara Concours d'Elegance</i> ad"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010ConcoursAd1.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010ConcoursAd1-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2010.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>24th Santa Barbara Concours d'Elegance</i> ad"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010ConcoursAd2.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010ConcoursAd2-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2010.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>24th Santa Barbara Concours d'Elegance</i> ad"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2010ConcoursAd3.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2010ConcoursAd3-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2010.</p>
					</li>



					<li>
						<h3><?php $caption = "<i>Chronicles of Quelouva</i> cover"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../chronicles/chronicles-cover.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/chronicles/chronicles-cover.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator and Photoshop, 2009.</p>
					</li>



					<li>
						<h3><?php $caption = "<i>About Connections</i> flyer"; echo $caption ?></h3>
							<?php echo '<a href="images/AC_flyer.pdf" rel="external">
								<img src="images/AC_flyer-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2008.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Castellino Training</i> trifold"; echo $caption ?></h3>
							<?php echo '<a href="images/CPBT_trifold.pdf" rel="external">
								<img src="images/CPBT_trifold-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2004.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>BEBA</i> trifold"; echo $caption ?></h3>
							<?php echo '<a href="images/BEBA_trifold.pdf" rel="external">
								<img src="images/BEBA_trifold-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>InDesign, 2004.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Fawn's</i> business card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/fawnscard.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/fawnscard-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Pencil and Photoshop, 2002</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Diane Steele</i> card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/Shaguar.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/Shaguar-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2001.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Felipe Soriano</i> card"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/Soriano.jpg&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/Soriano-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2001.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Live 5EX</i> album cover"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/LIVE_5EX_cover.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/LIVE_5EX_cover-thumb.png" alt="' . $caption . '" /></a>' ?>
						<p>Photoshop, 2001.</p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
