				<?
					if ($_SERVER['HTTPS']) {
						$protocol = 'https' ;
					} else {
						$protocol = 'http' ;
					}
					$basepath = $protocol
						. '://'
						. $_SERVER['SERVER_NAME']
						. dirname($_SERVER['PHP_SELF'])
						. '/' ;
				?>