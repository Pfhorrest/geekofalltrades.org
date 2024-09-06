<?php $title = "Infographic design by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

			<section>
				<h2>Infographic Design</h2>
				
				<p class="description">Examples of my infographic and data visualization design.</p>
			
				<?php
					$images = array(
						array(
							'title' => '<i>Codex</i> moods',
							'filename' => '../../../codex/images/moods.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> political spectrum',
							'filename' => '../../../codex/images/political-spectrum.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> reflexive functions',
							'filename' => '../../../codex/images/reflexive-functions.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> will functions',
							'filename' => '../../../codex/images/will-functions.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> web of reality',
							'filename' => '../../../codex/images/web-of-reality.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> progressive and conservative',
							'filename' => '../../../codex/images/progressive-conservative.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> boolean junctions',
							'filename' => '../../../codex/images/boolean-junctions.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> modality',
							'filename' => '../../../codex/images/modality.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> mood structure',
							'filename' => '../../../codex/images/mood-structure.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> opinions',
							'filename' => '../../../codex/images/opinions.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> communication',
							'filename' => '../../../codex/images/communication.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> relativism',
							'filename' => '../../../codex/images/relativism.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> phobosophies',
							'filename' => '../../../codex/images/principles-phobosophies.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> commensurablism',
							'filename' => '../../../codex/images/commensurablism.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> fields',
							'filename' => '../../../codex/images/fields.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Codex</i> history of philosophy',
							'filename' => '../../../codex/images/history-of-philosophy.png',
							'description' => 'Illustrator, 2019.'
						),
						array(
							'title' => '<i>Wood and Metal</i> elements',
							'filename' => '../../../stories/avatar-wood-and-metal.png',
							'description' => 'Illustrator, 2013.'
						),
						array(
							'title' => 'Reconstructed gender spectrum',
							'filename' => '../../../essays/reconstructinggender.png',
							'description' => 'Illustrator, 2013.'
						),
					);
					require $_SERVER['DOCUMENT_ROOT'] . "/display/gallery.php";
				?>

				<!-- <ul class="gallery expansive">
					<li>
						<h3><?php $caption = "<i>Codex</i> moods"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/moods.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/moods.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> political spectrum"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/political-spectrum.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/political-spectrum.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> reflexive functions"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/reflexive-functions.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/reflexive-functions.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> will functions"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/will-functions.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/will-functions.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> web of reality"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/web-of-reality.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/web-of-reality.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> progressive and conservative"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/progressive-conservative.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/progressive-conservative.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> boolean junctions"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/boolean-junctions.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/boolean-junctions.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> modality"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/modality.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/modality.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> mood structure"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/mood-structure.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/mood-structure.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> opinions"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/opinions.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/opinions.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> communication"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/communication.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/communication.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> relativism"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/relativism.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/relativism.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> phobosophies"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/principles-phobosophies.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/principles-phobosophies.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> commensurablism"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/commensurablism.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/commensurablism.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> fields"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/fields.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/fields.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Codex</i> history of philosophy"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../codex/images/history-of-philosophy.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/codex/images/history-of-philosophy.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2019.</p>
					</li>
					<li>
						<h3><?php $caption = "<i>Wood and Metal</i> elements"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../stories/avatar-wood-and-metal.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/stories/avatar-wood-and-metal.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2013.</p>
					</li>
					<li>
						<h3><?php $caption = "Reconstructed gender spectrum"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '../../essays/reconstructinggender.png&amp;title=' . rawurlencode($caption) . '" rel="external">
							<img src="/essays/reconstructinggender.png" alt="' . $caption . '" /></a>' ?>
						<p>Illustrator, 2013.</p>
					</li>

				</ul> -->
			</section>				

			<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
