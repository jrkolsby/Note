<?php
include("config.php");
if ($_POST['noteuser'] == $user && $_POST['notepass'] == $pass) {
	define("UPLOAD_DIR", "uploads/");
	$file = $_FILES['uploadfile'];
	$filename = $file["name"];
	$pagelocation = $_POST["pagelocation"];
	$parts = pathinfo($filename);
	$filename = str_replace(" ", "_", $filename);
	while (file_exists(UPLOAD_DIR . $filename)) {
		$i++;
		$filename = $parts["filename"] . "-" . $i . "." . $parts["extension"];
	}
	$success = move_uploaded_file($file["tmp_name"], UPLOAD_DIR . $filename);
	if ($success) {
		print "<meta http-equiv='REFRESH' content='0;url=$pagelocation?note=fil-" . $filename . "'>";
		exit;
	} else {
		print "<meta http-equiv='REFRESH' content='0;url=$pagelocation?note=err-" . $filename . "'>";
		exit;
	}
	chmod(UPLOAD_DIR . $filename, 0644);
}
?>