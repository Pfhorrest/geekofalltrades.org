<?php $title = "Photography by Forrest Cameranesi" ?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<h2>Photography</h2>
				
				<?php require $_SERVER['DOCUMENT_ROOT'] . "/display/basepath.php" ?>

				<ul class="gallery">
					<li>
						<h3><?php $caption = "Butter daisies at Waipi'o Valley Lookout"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . '2022/04/23/IMG_3778.JPG&title=' . rawurlencode($caption) . '" rel="external">
							<img src="2022/04/23/IMG_3778-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2022-04-23.</p>
						<p><a href="2022">More from 2022</a></p>
					</li>
					<li>
						<h3><?php $caption = "Bee on California Poppy at Ventura Harbor"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2021/06/IMG_8886.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2021/06/IMG_8886-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2021-06-20.</p>
						<p><a href="2021">More from 2021</a></p>
					</li>
					<li>
						<h3><?php $caption = "Toward the top of Cozy Dell"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2020/03/IMG_2143.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2020/03/IMG_2143-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2020-03-18.</p>
						<p><a href="2020">More from 2020</a></p>
					</li>
					<li>
						<h3><?php $caption = "The Pink Moment on Chief's Peak from Ojai Meadows"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2019/12/IMG_0116.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2019/12/IMG_0116-thumb.jpg" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 7, 2019-12-09.</p>
						<p><a href="2019">More from 2019</a></p>
					</li>
					<li>
						<h3><?php $caption = "The pier at Hueneme Beach"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2018/07/IMG_2818.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2018/07/IMG_2818-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 5s, 2018-07-21.</p>
						<p><a href="2018">More from 2018</a></p>
					</li>
					<li>
						<h3><?php $caption = "Yosemite Falls from Cook's Meadow"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2017/07/IMG_9125.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2017/07/IMG_9125-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 5s, 2017-07-12.</p>
						<p><a href="2017">More from 2017</a></p>
					</li>
					<li>
						<h3><?php $caption = "Wild mustard blooming at Ojai Meadows"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2016/03/IMG_4550.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2016/03/IMG_4550-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 5c, 2016-03-07.</p>
						<p><a href="2016">More from 2016</a></p>
					</li>
					<li>
						<h3><?php $caption = "Swing in the Ventura River Preserve"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2015/04/IMG_2217.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2015/04/IMG_2217-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>iPhone 5c, 2015-04-08.</p>
						<p><a href="2015">More from 2015</a></p>
					</li>
					<li>
						<h3><?php $caption = "The Grand Canyon from Ooh Aah Point"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2014/04/IMG_2611.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2014/04/IMG_2611-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>Canon PowerShot A530, 2014-04-20.</p>
						<p><a href="2014">More from 2014</a></p>
					</li>
					<li>
						<h3><?php $caption = "The Golden Gate Bridge from Fort Point"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2013/04/IMG_0821.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2013/04/IMG_0821-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>Canon PowerShot A530, 2013-04-21.</p>
						<p><a href="2013">More from 2013</a></p>
					</li>
					<li>
						<h3><?php $caption = "Statue at Hearst's Castle"; echo $caption ?></h3>
						<?php echo '<a href="/display/?image=' . $basepath . 'images/2012/07/IMG_9100.jpg&title=' . rawurlencode($caption) . '" rel="external">
							<img src="images/2012/07/IMG_9100-thumb.JPG" alt="' . $caption . '" /></a>' ?>
						<p>Canon PowerShot A530, 2012-07-29.</p>
						<p><a href="2012">More from 2012</a></p>
					</li>
				</ul>
				
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>