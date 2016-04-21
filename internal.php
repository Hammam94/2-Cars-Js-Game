<?php 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$score = $_POST['score'] + '\n';
	$myfile = fopen("score.txt", "w");
	write($myfile, $score);
	fclose($myfile);
}else {
	$score = $_GET['score'] + '\n';
	$myfile = fopen("score.txt", "R");
	fread($myfile, filesize("webdictionary.txt"));
	list($line) = split('\n', $myfile);
	list($name, $score) = split(":", $line);
	fclose($myfile);
}
 ?>