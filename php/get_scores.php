<?php
include_once('game_connect.php');
$score_pattern = '/\d+/';
$time_pattern = '/\d+/';
$date_string_pattern = '/(\d+-){2}\d{4}/';
$time_string_pattern = '/(\d+:){2}\d{2}/';
$score = htmlspecialchars(stripslashes($_POST['score']));
$time = htmlspecialchars(stripslashes($_POST['time']));
$date_string = htmlspecialchars(stripslashes($_POST['date_string']));
$time_string = htmlspecialchars(stripslashes($_POST['time_string']));
preg_match($score_pattern, $score, $score_match);
preg_match($time_pattern, $time, $time_match);
preg_match($date_string_pattern, $date_string, $date_string_match);
preg_match($time_string_pattern, $time_string, $time_string_match);
$score = (int)$score_match[0];
$time = $time_match[0];
$date_string = $date_string_match[0];
$time_string = $time_string_match[0];
if ($score > 0) {
	$query = "INSERT INTO fn_keyboard VALUES('','$score','$time','$date_string','$time_string')";
	//$result = mysql_query($query, $con);
	$result = mysqli_query($link,$query) or die("Unable to insert: ".mysql_error());
}
$query = "SELECT score,time,date_string,time_string FROM fn_keyboard ORDER BY score DESC limit 10";
//$result = mysql_query($link, $query);
$result = mysqli_query($link,$query) or die("Unable to select: ".mysql_error());
$num_rows = mysqli_num_rows($result);
$length = ($num_rows >= 10) ? 10 : $num_rows;
$max_scores = 10;
$scores = mysqli_fetch_all($result, MYSQLI_NUM);
//header("Content-type: text/xml");
echo "<?xml version='1.0' encoding='ISO-8859-1'?>";
echo "<scores>";
for ($i = 0; $i < $length; $i++){
	//$score = mysql_result($result, $i, 'score');
	//$time = mysql_result($result, $i, 'time');
	//$date_string = mysql_result($result, $i, 'date_string');
	//$time_string = mysql_result($result, $i, 'time_string');
	$row = $scores[$i];
	$score = $row[0];
	$time =  $row[1];
	$date_string = $row[2];
	$time_string = $row[3];
	echo "<score>".$score."</score>";
	echo "<time>".$time."</time>";
	echo "<date_string>".$date_string."</date_string>";
	echo "<time_string>".$time_string."</time_string>";
}
while (($max_scores - $length) > 0){
	echo "<score>0</score>";
	echo "<time>0</time>";
	echo "<date_string>0</date_string>";
	echo "<time_string>0</time_string>";
	$length += 1;
}
mysqli_free_result($result);
echo "</scores>";
mysqli_close($link);
?>
