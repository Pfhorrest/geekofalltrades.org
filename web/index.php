<?php
	$title = "Web Development &amp; Design by Forrest Cameranesi";
	$description = "Forrest Cameranesi is a professional full-stack web developer with decades of experience in diverse fields of application.";
?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<section>

					<h2>Web Development &amp; Design</h2>

					<p class="description">
						Screenshots and descriptions of web development and design projects
						that I've worked on, in reverse chronological order.
					</p>

					<section id="pantry">
						<h3>Ingredients Plus <i>Pantry</i> customer portal</h3>
						<p class="description">
							Built in NextJS / ReactJS with Supabase.
							(2023-2024)
						</p>
						<figure class="contained solo"><img src="images/pantry-screenshot.jpg" alt="Pantry screenshot" /></figure>
						<p>
							This is a customer portal for
							<a href="#ingredients-plus">Ingredients Plus</a>.
							Admin users of the portal can create accounts for
							the company's existing customers, and those customers
							can send an automated message to the admins requesting
							that they do so from the "Sign Up" button on the login
							screen. (Please don't try to "Sign Up" if you're not
							an actual customer of theirs, as you'll be wasting a
							real human being's time with that request.)
						</p>
						<p>
							Once logged in, customers are able to view their
							existing orders, contracts, and invoices, and submit
							new order requests. These new order requests are not 
							currently processed automatically, because the admins 
							wish at this stage to receive the order requests via email
							and manually enter them into their
							<a href="https://en.wikipedia.org/wiki/Sage_X3" rel="external">Sage ERP</a>
							for safety, but in a future stage new order requests may 
							automatically enter the order data into Sage.
							Data on existing orders, invoices, and contracts are all 
							drawn from Sage via API.
						</p>
						<p>
							Admin users can also create marketing content that will
							appear in sidebars of the customer interface, such as 
							Thought Leadership and Blog articles; and lastly, they
							can create surveys with open-answer, select-one, or
							select-all answer possibilities, and select the date 
							span in which those surveys will appear to customers,
							who can then answer them through their own user interface.
							The marketing content and survey data, like the user
							account data itself, is stored in Supabase tables.
						</p>
						<p>
							I was one of two people who helped to estimate this
							project initially. A third coworker took lead on actually
							building it out, setting up the Next project and the
							Supabase database and hosting, with principally me and
							to a smaller extent a fourth coworker supporting him.
							I touched virtually every aspect of the project by the end,
							both front-end user interface aspects and back-end server 
							actions submitting and retrieving data from Sage and Supabase,
							but probably the biggest and most complex contribution to
							the project I made was in the Surveys feature.
						</p>
						<p>
							That has both a complex front-end that allows admins to
							create, edit, reorder, and delete both survey questions,
							and possible answers to those questions if they are
							select-one or select-all types, tracking all of that in
							React state; as well as a back-end connecting the table
							of surveys, which stores all of that variable information
							as JSON, to the table of users, in a many-to-many fashion
							via a join table, which also stores that particular
							user's response to that particular survey in a JSON
							field in that join table row.
						</p>
						<p>
							The lead developer on this project praised me as indispensable
							in its completion.
						</p>
						<p>
							You can see the login screen at least at <a href="https://pantry.ingredientsplus.com" rel="external">pantry.ingredientsplus.com</a>.
						</p>
					</section>

					<section id="royal-copenhagen">
						<h3><i>Royal Copenhagen</i> Japan store</h3>
						<p class="description">
							Built in EC Cube (using Symphony / PHP and MySQL),
							with Freshworks CRM API, hosted on Amazon EC2.
							(2023-2024)
						</p>
						<figure class="contained solo"><img src="images/rc-jp-screenshot.jpg" alt="Royal Copenhagen Japan screenshot" /></figure>
						<p>
							This was a project to update the web store for
							<a href="https://www.royalcopenhagen.com" rel="external">Royal Copenhagen</a>'s
							official presence in Japan to the latest version of EC Cube, the most popular 
							ecommerce platform in Japan. To do so, we began with the similar project for
							<a href="#wedgwood">Wedgwood Japan</a> that we had done just prior, and made
							updates as appropriate for the different brand. Please see that entry below for
							further details.
						</p>
						<p>
							I was the main developer responsible for updating this project from the Wedgwood
							base it started as.
						</p>
						<p>
							You can see the finished product at <a href="https://www.royalcopenhagen.jp" rel="external">www.royalcopenhagen.jp</a>.
						</p>
					</section>

					<section id="moomin">
						<h3><i>Moomin Arabia</i> Japan store</h3>
						<p class="description">
							Built in EC Cube (using Symphony / PHP and MySQL),
							with Freshworks CRM API, hosted on Amazon EC2.
							(2023-2024)
						</p>
						<figure class="contained solo"><img src="images/moomin-jp-screenshot.jpg" alt="Moomin Arabia Japan screenshot" /></figure>
						<p>
							This was a project to update the web store for
							<a href="https://www.moominarabia.com" rel="external">Moomin Arabia</a>'s
							official presence in Japan to the latest version of EC Cube, the most popular 
							ecommerce platform in Japan. To do so, we began with the similar project for
							<a href="#wedgwood">Wedgwood Japan</a> that we had done just prior, and made
							updates as appropriate for the different brand. Please see that entry below for
							further details.
						</p>
						<p>
							I was the main developer responsible for updating this project from the Wedgwood
							base it started as.
						</p>
						<p>
							You can see the finished product at <a href="https://www.moominarabia.jp" rel="external">www.moominarabia.jp</a>.
						</p>
					</section>

					<section id="iittala">
						<h3><i>Iittala</i> Japan store</h3>
						<p class="description">
							Built in EC Cube (using Symphony / PHP and MySQL),
							with Freshworks CRM API, hosted on Amazon EC2.
							(2023-2024)
						</p>
						<figure class="contained solo"><img src="images/iittala-jp-screenshot.jpg" alt="Iittala Japan screenshot" /></figure>
						<p>
							This was a project to update the web store for
							<a href="https://www.iittala.com" rel="external">Iittala</a>'s
							official presence in Japan to the latest version of EC Cube, the most popular 
							ecommerce platform in Japan. To do so, we began with the similar project for
							<a href="#wedgwood">Wedgwood Japan</a> that we had done just prior, and made
							updates as appropriate for the different brand. Please see that entry below for
							further details.
						</p>
						<p>
							I only played a minor support role in the process of updating this project
							from the Wedgwood base it started as.
						</p>
						<p>
							You can see the finished product at <a href="https://www.iittala.jp" rel="external">www.iittala.jp</a>.
						</p>
					</section>

					<section id="wedgwood">
						<h3><i>Wedgwood</i> Japan store</h3>
						<p class="description">
							Built in EC Cube (using Symphony / PHP and MySQL),
							with Freshworks CRM API, hosted on Amazon EC2.
							(2023-2024)
						</p>
						<figure class="contained solo"><img src="images/wedgwood-jp-screenshot.jpg" alt="Wedgwood Japan screenshot" /></figure>
						<p>
							This was a project to update the web store for
							<a href="https://www.wedgwood.com" rel="external">Wedgwood</a>'s
							official presence in Japan to the latest version of EC Cube, the most popular 
							ecommerce platform in Japan. This apparently was not a simple matter of
							upgrading the underlying framework, but rather required that the newer version
							of the framework be installed from scratch, and then modified as necessary to
							match the various customizations that had been built atop the older version
							of it before.
						</p>
						<p>
							A coworker who was our main expert in PHP frameworks began this project on 
							her own, then myself and several other developers were brought on under her 
							direction to support various different aspects of the project. She left our 
							team not long afterward, and we all had to quickly up our game to get up to 
							speed with the tech stack and continue the project without her.
						</p>
						<p>
							In addition to that, I had the special task of integrating the user management
							of this web store, as well as three other web stores (listed above) owned by
							the same PE firm, to integrate with their
							<a href="https://en.wikipedia.org/wiki/Freshworks" rel="external">Freshworks CRM</a>
							via calls to its API
							at appropriate places in the user-management routines of the modified EC Cube
							project. I needed to make sure that updates users made to their information
							and settings in any store were reflected in the CRM without duplication, and
							that if user information was deleted from one store it was deleted from the 
							CRM only if that information was not also associated with a different store.
						</p>
						<p>
							I had no prior experience with such tasks but nevertheless completed that
							feature well under the allotted time and budget, to the praise of my supervisors.
						</p>
						<p>
							You can see the finished product at <a href="https://www.wedgwood.jp" rel="external">www.wedgwood.jp</a>.
						</p>
					</section>

					<section id="ingredients-plus">
						<h3><i>Ingredients Plus</i> site</h3>
						<p class="description">
							Built in Webflow.
							(2022-2024)
						</p>
						<figure class="contained solo"><img src="images/ip-screenshot.jpg" alt="Ingredients Plus screenshot" /></figure>
						<p>
							This is a fairly straightforward brochure-style site for Ingredients Plus,
							whom we rebranded from their old identity as Sweeteners Plus when they began working
							with us at Twisted Rope.
							Its most sophisticated features are the video backgrounds used especially on the home page,
							the searchable product catalogue making use of Webflow's Collections feature, and
							the custom main navigation menus that make extensive use of Webflow's Interactions feature.
						</p>
						<p>
							I was one of a few developers co-developing this site simultaneously,
							none of us especially more lead than another but just dividing up the
							necessary tasks between us. I touched many different aspects of the site 
							but the part that feels like my biggest contribution is that custom 
							main navigation menu.
						</p>
						<p>
							I felt that implementing those menus via Webflow Interactions was
							unnecessarily clunky, and could have been handled more elegantly in vanilla
							HTML/JS, but Webflow was the designated tool for the project, so I made sure
							to do things its way instead of hacking around it with custom code.
						</p>
						<p>
							You can see the finished product at <a href="https://www.ingredientsplus.com" rel="external">www.ingredientsplus.com</a>.
						</p>
					</section>

					<section id="twisted-rope">
						<h3><i>Twisted Rope</i> site</h3>
						<p class="description">
							Built in Webflow.
							(2022-2024)
						</p>
						<figure class="contained solo"><img src="images/tr-screenshot.jpg" alt="Twisted Rope screenshot" /></figure>
						<p>
							When I joined Twisted Rope, one of the early tasks assigned to myself and 
							some other new hires was to rebuild the company website. We did so over
							the course of early 2022, a fairly simply brochure-style page with little
							more sophisticated than some Webflow Interactions and Forms, and some
							carousels using SwiperJS.
						</p>
						<p>
							After about two years of that design getting only minor updates and expansions,
							our CEO wanted to redesign the site to better reflect the current character of 
							the company. I was one of two developers tasked with putting together design
							proposals, and although the CEO initially preferred mine over my coworker's,
							the coworker then put together another design proposal that our CEO ultimately
							went with. On the basis of that proposal and with the input from the entire
							company following the CEO's vision, that coworker and I then fleshed out the site
							in full. 
							</p>
						<p>
							It's not especially more sophisticated on the development side than the older
							site, but it's built much more cleanly and has much more cohesive design and
							messaging.
						</p>
						<p>
							You can see the finished product at <a href="https://www.twisted-rope.com" rel="external">www.twisted-rope.com</a>.
						</p>
					</section>
				
					<section id="goat">
						<h3><i>Geek of all Trades</i> site</h3>
						<p class="description">
							Built in vanilla PHP, HTML5, CSS3, and JS / jQuery.
							(2008-2024)
						</p>
						<figure class="contained solo"><img src="images/goat-screenshot.jpg" alt="Geek of all Trades screenshot" /></figure>
						<p>
							This is my own personal site. It's been gradually undergoing intermittent
							redevelopment since I first built it at this domain in 2008 &ndash; and even that 
							was loosely based on an even older, untitled personal site once hosted on 
							my old ISP, which had likewise been intermittently redeveloped since the late 90s.
						</p>
						<p>
							It's still basically vanilla code both because of that long history stretching
							back to when that was the only option, and because there has never really been 
							need for me to use any of the heavy complex frameworks that so many sites are 
							built in today, <em>and</em> honestly just because I like sticking to low-level 
							vanilla code whenever it's possible, and only using heavier frameworks when
							they are needed.
						</p>
						<p>
							Despite that long development history, I have iteratively cleaned up and
							refactored the code over time, especially as new versions of the core vanilla 
							technologies (HTML, CSS, JS) have become available and offered enhanced
							capabilities. I also make use of some things slightly beyond those as is useful:
							PHP mainly just for includes (so I can reuse code for the header and footer),
							and jQuery because some things (such as animating the dropdown menus in the 
							main navigation menu) are still needlessly clunky to implement even in ES6/CSS3.
						</p>
						<p>
							I like that I also get to stick to design features that I think are timeless and 
							optimal instead of having to follow trends, here in my own personal space on 
							the web. The main navigation system is inspired by a site I saw in the late 90s
							and I think it's better than other styles that are more common today. And I love 
							skeueomorphic styles, but knowing that they are currently out of fashion and 
							wanting to show my versatility, I now have the site by default show all flat
							styling, until an element is hovered over or otherwise interacted with, at which
							point it seamlessly transitions into subtler neuomorphic or full skeueomorphic
							depth instead.
						</p>
						<p>
							You're already here, but for completeness' sake: <a href="https://www.geekofalltrades.org" rel="external">www.geekofalltrades.org</a>.
						</p>
					</section>

					<section id="gnp">
						<h3>Get Nature Positive</h3>
						<p class="description">
							Built in WordPress with Sage theme
							(using Acorn / Laravel / Symphony / PHP)
							hosted on WPEngine.
							(2023)
						</p>
						<figure class="contained solo"><img src="images/gnp-screenshot.jpg" alt="Get Nature Positive screenshot" /></figure>
						<p>
							This project was created by some coworkers at Twisted Rope before I joined the company,
							but I eventually became the main support person &ndash; and after the last of the
							developers who originally built the project left, the sole point person &ndash; helping
							with maintenance and client edits, the latter especially involving accessibility fixes.
						</p>
						<p>
							This site is no longer online.
						</p>
					</section>

					<!-- <section id="zquip">
						<h3><i>Zquip</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2023)
						</p>
						<figure class="contained solo"><img src="images/zquip-screenshot.jpg" alt="Zquip screenshot" /></figure>
						<p>
							This project was mostly developed by my coworkers, but I helped with minor touch-ups
							and fixes here and there.
						</p>
						<p>
							You can see the finished product at <a href="https://www.zquip.tech" rel="external">www.zquip.tech</a>.
						</p>
					</section> -->

					<section id="mes">
						<h3>Accenture <i>Media & Entertainment Spotlight</i> interactive</h3>
						<p class="description">
							Built in vanilla HTML and CSS, hosted on AEM.
							(2023)
						</p>
						<figure class="contained solo"><img src="images/me-spotlight-screenshot.jpg" alt="Accenture Media &amp; Entertainment Spotlight screenshot" /></figure>
						<p>
							This project just involved embedding some code exported from InDesign by our
							design team into the appropriate place within the client's AEM site, with
							some surrounding introductory material. The project was begun by coworkers
							before my time at Twisted Rope, but it is an ongoing series with multiple
							issues released over time, and I was responsible for handling a few of them.
							It's only really worth mentioning because it's one of a few times I've had 
							to interact with AEM.
						</p>
						<p>
							You can see the finished product at <a href="https://www.accenture.com/us-en/insights/communications-media/media-entertainment-spotlight" rel="external">www.accenture.com</a>.
						</p>
					</section>

					<!-- <section id="cloud-outcomes">
						<h3>Accenture <i>Cloud Outcomes</i> interactive</h3>
						<p class="description">
							Built in vanilla HTML, CSS, and JS / jQuery, hosted on AEM.
							(2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="pahpow">
						<h3>PahPow app</h3>
						<p class="description">
							Built in Unity with Vuforia and Xcode,
							hosted on iOS App Store.
							(2023)
						</p>
						<p>
							This was an augmented reality greeting card app developed
							by some of my coworkers before my time at Twisted Rope.
							I had no role in actually creating the product, but I did 
							help with minor fixes and updates as needed. It's mostly 
							only worth mentioning because it's one of a few times I've 
							had to work with Unity or Xcode and the process of publishing
							to the iOS app store.
						</p>
						<p>
							This app is no longer available.
						</p>
					</section>

					<section id="workforce-inclusion">
						<h3>Accenture <i>Workforce Inclusion and Diversity Initiatives</i> interactive</h3>
						<p class="description">
							Built in HTML, SCSS / CSS, JS, JSON, and NodeJS, hosted on AEM.
							(2023)
						</p>
						<figure class="contained solo"><img src="images/accenture-inclusion-diversity-screenshot.jpg" alt="Accenture Workforce Inclusion &amp; Diversity Initiatives interactive screenshot" /></figure>
						<p>
							This project is what the client refers to as an "interactive element" of an
							otherwise fairly static page, where data is displayed in a more complex manner
							with somewhat sophisticated Javascript and CSS pulling from a JSON file.
						</p>
						<p>
							A coworker began this project before my time at Twisted Rope, but I was tasked 
							with doing a major overhaul of it, and with further updates later. I quite
							enjoyed building the fun circular graphs with plain CSS (well, compiled from
							SCSS, but still) with some property values controlled by the JS pulling from
							the JSON data, got to actually apply a little trigonometry to calculate it 
							all, which was nice.
						</p>
						<p>
							You can see the finished product at <a href="https://www.accenture.com/us-en/about/inclusion-diversity/us-workforce#container-486ffa07b4" rel="external">www.accenture.com</a>.
						</p>
					</section>

					<!-- <section id="macquarie">
						<h3>Accenture <i>Macquarie</i> microsite</h3>
						<p class="description">
							Built in Webflow.
							(2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- just small edits --
					</section> -->

					<!-- <section id="innovation-symposium">
						<h3>Accenture <i>Innovation Symposium</i> microsite</h3>
						<p class="description">
							Built in Webflow.
							(2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- no longer online --
					</section> -->

					<section id="moog">
						<h3><i>Moog Construction</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022-2023)
						</p>
						<figure class="contained solo"><img src="images/moog-screenshot.jpg" alt="Moog Construction screenshot" /></figure>
						<p>
							A fairly straightforward brochure-style site for Moog Construction, this was mostly 
							developed by one of my coworkers, but I helped resolve some tricky CSS 
							issues (as the main CSS expert on our team) and served in some other support roles
							such as QA and bugfixes.
						</p>
						<p>
							You can see the finished product at <a href="https://www.moogconstruction.com" rel="external">www.moogconstruction.com</a>.
						</p>
					</section>

					<!-- <section id="kates-kesler">
						<h3><i>Kates Kesler</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022-2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- migration, no longer online --
					</section> -->

					<!-- <section id="greenfish">
						<h3><i>Greenfish</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022-2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- migration, no longer online --
					</section> -->

					<!-- <section id="cyberfashion">
						<h3><i>CyberFashion</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022-2023)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="landmark">
						<h3><i>Landmark</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022-2023)
						</p>
						<figure class="contained solo"><img src="images/landmark-screenshot.jpg" alt="Landmark screenshot" /></figure>
						<p>
							This was a team project to completely rebuild the site for a client whose old 
							site looked like it hadn't been updated in decades. The new site is still a
							fairly straightforward brochure-style site, but instead of being entirely
							static and made for only small desktop screens, it's now full of video and
							other motion and responsive for all viewports from modern large desktop screens 
							to mobile phones and everything in between.
						</p>
						<p>
							I was one of a few developers working on this rebuild, following designs put 
							together by our design team. None of us was particularly more the lead than 
							anyone else, and the load was fairly evenly distributed between us, each of 
							us building a selection of different kinds of sections that would be reused 
							across the site, and then assembling a selection of individual pages from 
							those reusable section components.
						</p>
						<p>
							You can see the finished product at <a href="https://www.teamlandmark.com" rel="external">www.teamlandmark.com</a>.
						</p>
					</section>

					<section id="global-delivery-centers">
						<h3>Accenture <i>Global Delivery Centers Map</i> interactive</h3>
						<p class="description">
							Built in HTML, SCSS / CSS, JS, JSON, and NodeJS, hosted on AEM.
							(2022-2023)
						</p>
						<figure class="contained solo"><img src="images/accenture-global-delivery-centers-screenshot.jpg" alt="Accenture Global Delivery Centers interactive screenshot" /></figure>
						<p>
							This project is what the client refers to as an "interactive element" of an
							otherwise fairly static page, where data is displayed in a more complex manner
							with somewhat sophisticated Javascript and CSS pulling from a JSON file.
						</p>
						<p>
							A coworker began this project before my time at Twisted Rope, but I was tasked 
							with ongoing updates and maintenance over time.
						</p>
						<p>
							You can see the finished product at <a href="https://www.accenture.com/us-en/services/technology/delivery-centers" rel="external">www.accenture.com</a>.
						</p>
					</section>

					<section id="moog-demos">
						<h3><i>Moog</i> convention demos</h3>
						<p class="description">
							Built in Webflow with heavily customized CSS and JS.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/moog-bauma-screenshot.jpg" alt="Moog Bauma demo screenshot" /></figure>
						<p>
							These were three similar projects, all stand-alone sites that could run locally 
							in a browser on a tablet not connected to the internet at the
							<a href="#moog">Moog</a> booth at the
							<a href="https://bauma.de" rel="external">Bauma</a> convention. One of them had
							already been partially built by a coworker in Webflow, with mostly static content
							except for a "screensaver" effect (a some Javascript that would trigger a video 
							overlay after a period of inactivity). I took over finishing that project,
							fleshing out some cool transition effects for when the buttons on the main menu
							were clicked, using just JS and CSS, and then developed the other two similar
							demos all on my own, based loosely on that first project.
						</p>
						<p>
							You can see one of the latter finished products at <a href="https://baumamachine3.webflow.io" rel="external">baumamachine3.webflow.io</a>.
						</p>
					</section>

					<!-- <section id="xoomworks">
						<h3><i>Xoomworks</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="erp">
						<h3>Accenture <i>ERP@Motion</i> microsite</h3>
						<p class="description">
							Built in Webflow, with custom JS drawing from
							an API served on Node, hosted on Amazon EC2.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/erp-screenshot.jpg" alt="ERP@Motion screenshot" /></figure>
						<p>
							This was originally a simple static microsite built as an educational resource 
							for employees of a company the client had just acquired, which a coworker of 
							mine had built in Webflow and exported for hosting on one of our EC2 servers
							before my time. However at one point the client needed those employees to be 
							able to register themselves for educational events related to the merger, so 
							another coworker of mine built a simple database in Node to store that 
							registration data, and I was tasked with building two Javascript-driven
							front-ends to access that database, one for the users to do their own 
							self-registration, and another for administrators to view and edit that 
							registration data.
						</p>
						<p>
							This site is no longer online.
						</p>
					</section>

					<!-- <section id="business-modernisation">
						<h3>Accenture <i>Business Modernisation for Support</i> microsite</h3>
						<p class="description">
							Built in Webflow.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="ergodata">
						<h3><i>Ergodata</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme, hosted on WPEngine.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="runzy">
						<h3>Runzy</h3>
						<p class="description">
							Built in Laravel / Symphony / PHP with MySQL and Elasticsearch.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/runzy-screenshot.jpg" alt="Runzy screenshot" /></figure>
						<p>
							This project is a search engine for running events. It was started 
							by one of my more senior coworkers who then brought on myself and
							another coworker who had joined around the same time as me to flesh 
							out the front and back ends respectively, myself being our resident
							CSS expert and she being our resident PHP expert.
						</p>
						<p>
							You can see the finished product at <a href="https://runzy.com" rel="external">runzy.com</a>.
						</p>
					</section>

					<section id="founders-intelligence">
						<h3><i>Founders Intelligence</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/founders-intelligence-screenshot.jpg" alt="Founders Intelligence screenshot" /></figure>
						<p>
							This was a migration of the client's existing site, to be reimplemented in WordPress 
							and hosted on WPEngine, as required by their new parent company. We at Twisted Rope 
							did many such projects for new acquisitions by Accenture, usually dividing them up
							roughly evenly across two to four developers, none especially more lead than another.
						</p>
						<p>
							Unlike some of our earlier migrations, rather than
							recreating the original site as faithfully as possible
							using the native components of the Divi theme theme that we used in
							WordPress, plus touches of additional
							custom code as needed, in this project we simply copied code from the original site
							as directly as possible into custom code containers within Divi, for greater
							time efficiency (but less easy of future modification).
						</p>
						<p>
							You can see the finished product at <a href="https://www.foundersintelligence.com" rel="external">www.foundersintelligence.com</a>.
						</p>
					</section>

					<!-- <section id="clearedge">
						<h3><i>ClearEdge</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="ta-cook">
						<h3><i>TA Cook</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="paris-facil-famille">
						<h3><i>Paris Facil Famille</i> site</h3>
						<p class="description">
							Built in Webflow.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="building-sustainable-futures">
						<h3>Accenture <i>Building Sustainable Futures</i> podcast feature</h3>
						<p class="description">
							Built in vanilla HTML, CSS, and JS / jQuery, hosted on Sitecore.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/building-sustainable-futures-screenshot.jpg" alt="Building Sustainable Futures screenshot" /></figure>
						<p>
							This is a page or microsite for an Accenture podcast. It was quite 
							enjoyable just building this in vanilla code, structurally and 
							semantically clean, with interactivity handled through some
							basic Javascript (later converted to jQuery by request of the client,
							but that's a simple translation and no less elegant than the original
							vanilla ES6) and simple CSS animations.
						</p>
						<p>
							You can see the finished product at <a href="https://www.accenture.com/gb-en/insights/sustainability/building-sustainable-futures" rel="external">www.accenture.com</a>.
						</p>
						
					</section>

					<section id="liquid-studios">
						<h3>Accenture <i>Liquid Studios Map</i> interactive</h3>
						<p class="description">
							Built in HTML, SCSS / CSS, JS, JSON, and NodeJS, hosted on Sitecore.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/accenture-global-delivery-centers-screenshot.jpg" alt="Accenture Global Delivery Centers interactive screenshot" /></figure>
						<p>
							This project is what the client refers to as an "interactive element" of an
							otherwise fairly static page, where data is displayed in a more complex manner
							with somewhat sophisticated Javascript and CSS pulling from a JSON file.
						</p>
						<p>
							A coworker began this project before my time at Twisted Rope, but I was tasked 
							with ongoing updates and maintenance over time.
						</p>
						<p>
							You can see the finished product at <a href="https://www.accenture.com/us-en/services/technology/liquid-studios#anchor2" rel="external">www.accenture.com</a>.
						</p>
					</section>

					<!-- <section id="sustainable-development">
						<h3>Accenture <i>Sustainable Development Goals Initiative</i> interactive</h3>
						<p class="description">
							Built in HTML, SCSS / CSS, JS, JSON, and NodeJS, hosted on Sitecore.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="scott-vanner">
						<h3><i>Scott Vanner</i> site</h3>
						<p class="description">
							Built in Webflow.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="blueworx">
						<h3><i>Blueworx</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2022)
						</p>
						<figure class="contained solo"><img src="images/blueworx-screenshot.jpg" alt="BlueWorx screenshot" /></figure>
						<p>
							This was a migration of the client's existing site, to be reimplemented in WordPress 
							and hosted on WPEngine, as required by their new parent company. We at Twisted Rope 
							did many such projects for new acquisitions by Accenture, usually dividing them up
							roughly evenly across two to four developers, none especially more lead than another.
						</p>
						<p>
							Unlike some of our later migrations, rather than copying code from the original site
							as directly as possible into custom code containers within the Divi theme we used in
							WordPress, this project has the original site recreated as faithfully as possible
							using the native components of the Divi theme itself, plus touches of additional
							custom code as needed, for greater ease of future modification, albeit at the
							expense of less up-front time efficiency.
						</p>
						<p>
							You can see the finished product at <a href="https://www.blueworx.app" rel="external">www.blueworx.app</a>.
						</p>
					</section>

					<!-- <section id="tritone">
						<h3><i>Tritone</i> site</h3>
						<p class="description">
							Built in Webflow.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="legato">
						<h3>Legato</h3>
						<p class="description">
							Built in ReactJS and Laravel / Symphony / PHP with MySQL.
							(2022)
						</p>
						<p>
							More details, screenshots, and links coming soon.
						</p>
					</section> -->

					<!-- <section id="trrt">
						<h3>Twisted Rope internal reporting tool</h3>
						<p class="description">
							Built in NextJS / ReactJS and Laravel / Symphony / PHP.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="template-tool">
						<h3>Twisted Rope sitecore template tool</h3>
						<p class="description">
							Built in NextJS / ReactJS and Laravel / Symphony / PHP.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="areveryware">
						<h3>AReveryware app</h3>
						<p class="description">
							Built in Unity with Vuforia and Xcode,
							hosted on iOS App Store.
							(2022)
						</p>
						<p>
							This was an augmented reality greeting card app developed
							by some of my coworkers before my time at Twisted Rope.
							I had no role in actually creating the product, but I did 
							help with minor fixes and updates as needed. It's mostly 
							only worth mentioning because it's one of a few times I've 
							had to work with Unity or Xcode and the process of publishing
							to the iOS app store.
						</p>
						<p>
							This app is no longer available.
						</p>
					</section>

					<!-- <section id="why-accenture">
						<h3>Accenture <i>Why Accenture</i> interactive</h3>
						<p class="description">
							Built in vanilla HTML, CSS, and JS, hosted on Sitecore.
							(2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<!-- <section id="edenhouse">
						<h3><i>Edenhouse</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2021-2022)
						</p>
						<figure class="contained solo"><img src="images/blueworx-screenshot.jpg" alt="BlueWorx screenshot" /></figure>
						<p>
							This was a migration of the client's existing site, to be reimplemented in WordPress 
							and hosted on WPEngine, as required by their new parent company. We at Twisted Rope 
							did many such projects for new acquisitions by Accenture, usually dividing them up
							roughly evenly across two to four developers, none especially more lead than another.
						</p>
						<p>
							Unlike some of our later migrations, rather than copying code from the original site
							as directly as possible into custom code containers within the Divi theme we used in
							WordPress, this project has the original site recreated as faithfully as possible
							using the native components of the Divi theme itself, plus touches of additional
							custom code as needed, for greater ease of future modification, albeit at the
							expense of less up-front time efficiency.
						</p>
						<p>
							You can see the finished product at <a href="https://www.blueworx.app" rel="external">www.blueworx.app</a>.
						</p>
					</section> -->

					<!-- <section id="repl">
						<h3><i>REPL Group</i> site</h3>
						<p class="description">
							Built in WordPress with Divi theme on WPEngine.
							(2021-2022)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
					</section> -->

					<section id="eternal">
						<h3><i>Eternal</i> site</h3>
						<p class="description">
							Built in vanilla HTML5, SASS / CSS3, PHP, and JS / jQuery.
							(2004-2020)
						</p>
						<figure class="contained solo"><img src="images/eternal-screenshot.jpg" alt="Eternal screenshot" /></figure>
						<p>
							This is a simple static brochure-style site for my own personal game mod
							<i>Eternal</i>, that I have been gradually updating since the first public 
							release of that ongoing project. It only uses PHP for the purpose of
							includes so I don't need to replicate the header/footer/etc on every sub-page,
							and is  otherwise pretty vanilla code, that has been updated to the newer
							versions  of the basic web technologies as they have rolled out.
						</p>
						<p>
							Although it has a visual style very much like the 1990s computer games that
							the mod is for, it's all fully responsive and much more modern under the
							hood than you would think at first glance, even if it is still quite simple,
							with nothing more complex that what's needed.
						</p>
						<p>
							You can see the finished product at <a href="https://eternal.bungie.org" rel="external">eternal.bungie.org</a>.
						</p>
					</section>

					<section id="cpbt">
						<h3><i>Castellino Training</i> site</h3>
						<p class="description">
							Built in vanilla HTML5, CSS3, and PHP.
							(2002-2020)
						</p>
						<figure class="contained solo"><img src="images/cpbt-screenshot.jpg" alt="Castellino Training screenshot" /></figure>
						<p>
							I was hired by the Castellinos specifically to build them a website in what was
							originally just going to be a summer job between my first two terms at college,
							but I wound up sticking around with them for nearly a decade as their general
							technical and administrative assistant, not only their "webmaster" (which was
							still a thing you could do for a job back then) but their database admin,
							network and IT admin, and basically any other hats they needed me to wear.
						</p>
						<p>
							Of course the website got many updates along the way too, and I even swung
							around now and again long after I left them for greener pastures to help with
							little touch-ups as needed. For the most part I haven't touched the site for
							years though, and it seems that other people have, so its current appearance
							and content is only loosely based on my work, which you can see more
							accurately represented in the old screenshot above.
						</p>
						<p>
							You can see the current version at <a href="https://www.castellinotraining.com" rel="external">www.castellinotraining.com</a>.
						</p>
					</section>

					<section id="mbo">
						<h3>Myth @ Bungie.Org</h3>
						<p class="description">
							Built in vanilla HTML5, CSS3, MGI, and JS / jQuery.
							(1998-2020)
						</p>
						<figure class="contained solo"><img src="images/mbo-screenshot.jpg" alt="Myth @ Bungie.Org screenshot" /></figure>
						<p>
							This is by far the oldest site of mine that's still online, for another old video 
							game I was a fan of back in the late 90s. I didn't build the original version, but
							I did orchestrate the merger between the two older fan sites that eventually became
							this site, and over time I gradually took over running that, including redeveloping
							it as the years went by and technology changed, even long after the active years of
							the community had faded, just as a labor of love.
						</p>
						<p>
							It still looks a lot like something from the 90s, befitting the aesthetics of the
							game that it's about, but aside from the truly ancient pre-PHP back-end using
							<a href="http://www.pageplanetsoftware.com/products.html" rel="external">MGI</a>,
							the technologies and techniques are all relatively modern, using semantic HTML5,
							lightweight CSS for visuals that would have been prebaked images back in the day,
							some JS and jQuery for interactions that wouldn't have even been possible back
							then, all responsive on viewport sizes from mobile to our giant desktop displays
							of today.
						</p>
						<p>
							You can see the finished product at <a href="https://www.castellinotraining.com" rel="external">www.castellinotraining.com</a>.
						</p>
					</section>

					<!-- <section id="beba">
						<h3><i>BEBA</i> site</h3>
						<p class="description">
							Built in vanilla HTML5, CSS3, and PHP.
							(2002-2012)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer using my design --
					</section> -->

					<!-- <section id="smg">
						<h3><i>Stratus Media Group</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1, CSS 2.1, PHP, and JS / jQuery.
							(2011)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer online --
					</section> -->

					<!-- <section id="mmnat">
						<h3><i>Mille Miglia North America Tribute</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1, CSS 2.1, PHP, and JS / jQuery.
							(2011)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer online --
					</section> -->

					<!-- <section id="tour-delegance">
						<h3><i>National Tour d'Elegance</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1, CSS 2.1, PHP, and JS / jQuery.
							(2010-2011)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer online --
					</section> -->

					<!-- <section id="antique-dolls">
						<h3><i>Antique Dolls</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1, CSS 2.1, and PHP, with MySQL.
							(2009)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer online --
						-- <a href="https://www.github.com/Pfhorrest/antiquedollsofsantabarbara.com" rel="external"><img src="images/AntiqueDollsSite_thumb.png" alt="thumbnail" /></a> --
					</section> -->

					<section id="anacapa-equipment">
						<h3><i>Anacapa Equipment</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1, CSS 2.1, and PHP, with MySQL.
							(2009)
						</p>
						<p>
							This was one of my first projects delving into more dynamic back-end work
							instead of simple, mostly brochure-style projects built almost entirely
							on the front end. It was a catalogue site for someone who sold used
							industrial equipment, so it resembled an ecommerce site on the front
							end, with a search form and a list of categories, either of which would 
							display tiled thumbnails for matching products which could then be clicked
							to view further details. There was also a password-protected admin interface
							where the client could add, remove, and edit products from the catalogue,
							including images.
						</p>
						<p>
							My version of this site is no longer online.
						</p>
					</section>

					<!-- <section id="anacapa-mobile">
						<h3><i>Anacapa Mobile</i> site</h3>
						<p class="description">
							Built in vanilla XHTML 1.1 and CSS 2.1.
							(2009)
						</p>
						<p>More details, screenshots, and links coming soon.</p>
						-- No longer online --
						-- <a href="https://www.github.com/Pfhorrest/anacapamobile.com/" rel="external"><img src="images/AnacapaMobileSite_thumb.png" alt="thumbnail" /></a> --
					</section> -->

				</section>

<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>