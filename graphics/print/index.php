<?php $title = "Print Design by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

			<section>
				<h2>Print Design</h2>

				<p class="description">Examples of my design for print.</p>

				<?php
					$images = array(
						array(
							'title' => 'My resume',
							'filename' => 'resume-thumb.png',
							'altlink' => 'resume.pdf',
							'description' => 'Illustrator and Photoshop, 2020.'
						),
						array(
							'title' => '<i>Monterey Company</i> sample card',
							'filename' => 'monterey_sample.png',
							'description' => 'Illustrator, 2012.'
						),
						array(
							'title' => '<i>Monterey Company</i> proof sheet',
							'filename' => 'monterey_proof.jpg',
							'description' => 'Illustrator, 2012.'
						),
						array(
							'title' => 'My business card',
							'filename' => 'forrest-card.png',
							'description' => 'Illustrator and Photoshop, 2011.'
						),
						array(
							'title' => '2011 <i>Concours d\'Elegance</i> tickets',
							'filename' => '2011Concours-tickets.png',
							'description' => 'Illustrator, 2011.'
						),
						array(
							'title' => '<i>Stratus Media Group</i> business card',
							'filename' => 'StratusBC-vertical.jpg',
							'description' => 'Illustrator, 2011.'
						),
						array(
							'title' => '<i>Mille Miglia</i> poster',
							'filename' => '2010mille-poster-h6.jpg',
							'description' => 'Photoshop, 2011.'
						),
						array(
							'title' => '<i>Mille Miglia</i> poster',
							'filename' => '2010mille-poster-v1.jpg',
							'description' => 'Photoshop, 2011.'
						),
						array(
							'title' => '<i>Under The Magic Sky</i> album cover',
							'filename' => 'magicsky.jpg',
							'description' => 'Photoshop, 2010.'
						),
						array(
							'title' => '<i>Concours d\'Elegance</i> ticket',
							'filename' => '2010-concours-ticket-sunday.png',
							'description' => 'Photoshop, 2010.'
						),
						array(
							'title' => '2010 <i>Mille Miglia Salute</i> route book',
							'filename' => '2010MilleSaluteRoute-thumb.jpg',
							'altlink' => '2010MilleSaluteRoute.pdf',
							'description' => 'Photoshop and InDesign, 2010.'
						),
						array(
							'title' => '<i>24th Santa Barbara Concours d\'Elegance</i> ad',
							'filename' => '2010ConcoursAd1.jpg',
							'description' => 'InDesign, 2010.'
						),
						array(
							'title' => '<i>24th Santa Barbara Concours d\'Elegance</i> ad',
							'filename' => '2010ConcoursAd2.jpg',
							'description' => 'InDesign, 2010.'
						),
						array(
							'title' => '<i>24th Santa Barbara Concours d\'Elegance</i> ad',
							'filename' => '2010ConcoursAd3.jpg',
							'description' => 'InDesign, 2010.'
						),
	
	
	
						array(
							'title' => '<i>Chronicles of Quelouva</i> cover',
							'filename' => '../../../chronicles/chronicles-cover.jpg',
							'description' => 'Illustrator and Photoshop, 2009.'
						),
	
	
	
						array(
							'title' => '<i>About Connections</i> flyer',
							'filename' => 'AC_flyer-thumb.jpg',
							'altlink' => 'AC_flyer.pdf',
							'description' => 'InDesign, 2008.'
						),
						array(
							'title' => '<i>Castellino Training</i> trifold',
							'filename' => 'CPBT_trifold-thumb.jpg',
							'altlink' => 'CPBT_trifold.pdf',
							'description' => 'InDesign, 2004.'
						),
						array(
							'title' => '<i>BEBA</i> trifold',
							'filename' => 'BEBA_trifold-thumb.jpg',
							'altlink' => 'BEBA_trifold.pdf',
							'description' => 'InDesign, 2004.'
						),
						array(
							'title' => '<i>Fawn\'s</i> business card',
							'filename' => 'fawnscard.jpg',
							'description' => 'Pencil and Photoshop, 2002'
						),
						array(
							'title' => '<i>Diane Steele</i> card',
							'filename' => 'Shaguar.jpg',
							'description' => 'Photoshop, 2001.'
						),
						array(
							'title' => '<i>Felipe Soriano</i> card',
							'filename' => 'Soriano.jpg',
							'description' => 'Photoshop, 2001.'
						),
						array(
							'title' => '<i>Live 5EX</i> album cover',
							'filename' => 'LIVE_5EX_cover.png',
							'description' => 'Photoshop, 2001.'
						),
					);
					require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
				?>

				<!-- <ul class="gallery expansive">
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
				</ul> -->
			</section>

			<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
