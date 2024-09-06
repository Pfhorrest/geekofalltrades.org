<?php 
	if ($_GET["title"]) {
		$t = $_GET["title"] ;
		} else {
		$t = "Image" ;
		}
	$title = $t . " by Forrest Cameranesi"
?>
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

		<figure class="display">
			<h2><?php echo $_GET["title"] ; ?></h2>
			<?php echo "<img src='" . $_GET["image"] . "' alt='" . $t . "' />" ; ?>
		</figure>

<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
