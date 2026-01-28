<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Diretório para armazenar os vídeos
$uploadDir = 'videos/';
$dbFile = 'videos.json';

// Cria o diretório se não existir
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Verifica se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Verifica se o arquivo foi enviado
if (!isset($_FILES['video']) || !isset($_POST['title'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Arquivo de vídeo ou título não fornecido']);
    exit;
}

$file = $_FILES['video'];
$title = trim($_POST['title']);

// Valida o título
if (empty($title)) {
    http_response_code(400);
    echo json_encode(['error' => 'Título não pode ser vazio']);
    exit;
}

// Verifica se houve erro no upload
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao fazer upload do arquivo']);
    exit;
}

// Valida o tipo de arquivo
$allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de arquivo não permitido. Use MP4, MPEG, MOV, AVI ou WebM']);
    exit;
}

// Valida o tamanho (limite de 100MB)
$maxSize = 100 * 1024 * 1024; // 100MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Arquivo muito grande. Tamanho máximo: 100MB']);
    exit;
}

// Gera um nome único para o arquivo
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('video_', true) . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move o arquivo para o diretório de destino
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar o arquivo']);
    exit;
}

// Carrega os metadados existentes
$videos = [];
if (file_exists($dbFile)) {
    $videos = json_decode(file_get_contents($dbFile), true) ?: [];
}

// Adiciona os metadados do novo vídeo
$videoData = [
    'id' => uniqid(),
    'title' => $title,
    'filename' => $filename,
    'path' => $filepath,
    'size' => $file['size'],
    'mime_type' => $mimeType,
    'uploaded_at' => date('Y-m-d H:i:s'),
    'original_name' => $file['name']
];

$videos[] = $videoData;

// Salva os metadados
file_put_contents($dbFile, json_encode($videos, JSON_PRETTY_PRINT));

// Retorna sucesso
http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Vídeo enviado com sucesso',
    'video' => $videoData
]);
?>
