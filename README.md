# HicSuntDracones

## OpenAI integration

The game can generate new adventure text using the OpenAI API. To enable this
feature create `config.php` in the project root with your API key:

```php
<?php
const OPENAI_API_KEY = 'REPLACETHISWITHYOURACTUALAPIKEY';
```

Ensure your PHP server has cURL enabled. When the player chooses an option with
no predefined path, the client sends the recent story history to `openai.php`
which calls the API and returns a new story section in JSON.
