<?php

$base_url = "http://" . $_SERVER['HTTP_HOST'];
$dir = dirname($_SERVER['REQUEST_URI']);
if (strlen($dir) > 1) {
    $base_url .= $dir . '/';
} else {
    $base_url .= '/';
}

header('Content-type: application/x-javascript');
echo "var base_url = '" . $base_url . "';";
