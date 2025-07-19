<?php
require_once __DIR__ . '/config.php';

$apiKey = OPENAI_API_KEY ?? '';
if (!$apiKey || stripos($apiKey, 'REPLACETHIS') !== false) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'OpenAI API key not configured. Update config.php']);
    exit;
}

$history = json_decode($_POST['history'] ?? '[]', true);

$examples = [];
$exampleFiles = array_slice(glob(__DIR__.'/texts/*.json'), 0, 5);
foreach ($exampleFiles as $file) {
    $examples[basename($file)] = json_decode(file_get_contents($file), true);
}

$prompt = "Using the style of these examples: " . json_encode($examples) . "\n" .
          "and considering the recent story history: " . json_encode($history) .
          "\nGenerate the next adventure section in JSON with the same structure.";

$payload = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => 'You create short choose-your-own-adventure sections. Return JSON only.'],
        ['role' => 'user', 'content' => $prompt]
    ],
    'temperature' => 0.8,
    'max_tokens' => 500
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . OPENAI_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');
if ($error || $httpCode >= 400) {
    echo json_encode([
        'error' => $error ?: ('HTTP ' . $httpCode),
        'http_code' => $httpCode
    ]);
} else {
    echo $response;
}
