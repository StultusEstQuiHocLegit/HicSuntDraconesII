<?php
require_once __DIR__ . '/config.php';

$history = json_decode($_POST['history'] ?? '[]', true);

$examples = [];
foreach (glob(__DIR__.'/texts/*.json') as $file) {
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
$error = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');
if ($error) {
    echo json_encode(['error' => $error]);
} else {
    echo $response;
}
