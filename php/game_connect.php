<?php
	//header("Content-type: text/xml");
	//$db = parse_ini_file('../../../../../php_includes/db.ini')
	include('../../../../php_includes/config_db.php');
	//$db = parse_ini_file('db.ini')
	//$hostname = $db['hostname'];
	//$username = $db['username'];
	//$password = $db['password'];
	//$database = 'pedaplus_flashgames';
	header("Content-type: text/xml");
	$link = mysqli_connect($hostname,	$username, $password, $database);
	if (mysqli_connect_errno()) {
		die("Game db connection failed: %s\n" + mysqli_connect_error());
		exit();
	}
?>
