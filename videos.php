<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$dbFile = 'videos.json';

// Verifica se é uma requisição GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Carrega os metadados dos vídeos
$videos = [];
if (file_exists($dbFile)) {
    $videos = json_decode(file_get_contents($dbFile), true) ?: [];
}

// Ordena por data de upload (mais recentes primeiro)
usort($videos, function($a, $b) {
    return strtotime($b['uploaded_at']) - strtotime($a['uploaded_at']);
});

// Retorna a lista de vídeos
http_response_code(200);
echo json_encode($videos);
?>
