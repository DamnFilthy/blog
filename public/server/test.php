<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Разрешить CORS, если нужно

$response = [
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    'message' => 'Hello World'
];

echo json_encode($response);
exit;
?>