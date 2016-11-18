<?php


$user = "jappleseed"; //EDIT "username" TO CHANGE YOUR USERNAME.

$pass = "password"; //EDIT "password" TO CHANGE YOUR USERNAME.

$domainroot = ""; //EDIT "" TO CHANGE THE DOMAIN ROOT.


ini_set('display_errors','Off');
if ($_POST["response"] == "print") {
	if ($_COOKIE['notecmspass']==$pass&&$_COOKIE['notecmsuser']==$user){
		print "true";
	} else if ($_POST['pass']==$pass&&$_POST['user']==$user){
		print "true";
	} else {
		print "false";
	}
}
?>
