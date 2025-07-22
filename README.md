# HicSuntDracones

Hic Sunt Dracones is a small web based language-learning adventure game. It mixes PHP for the page logic with plain JavaScript for dynamic interactions and uses the OpenAI API to generate story chapters on the fly. The repository contains the minimal assets needed to run the prototype.

## Local test setup

1. Copy or clone this repository.
2. Edit `src/storyGenerator.js` and replace the value `PLACEHOLDER` of `OPENAI_API_KEY` with your own OpenAI API key.
3. Serve the project with PHP's built in server:
   ```bash
   php -S localhost:8000
   ```
4. Visit `http://localhost:8000/index.php` in your browser to start the game.

## Project structure

```
.
├── css/                 # Styles for the pages
│   └── style.css
├── js/                  # Front‑end logic
│   └── main.js          # Handles story display, inventory and UI behaviour
├── resources/           # Game data (animals, items)
│   ├── animals.json
│   └── items.json
├── src/
│   └── storyGenerator.js  # Talks to OpenAI and stores progress
├── texts/               # Fallback story snippets if API fails
│   └── *.json
├── translations/        # UI translations for English, French and Spanish
│   └── *.json
├── index.php            # Character creation and language selection
├── game.php             # Main game interface
└── menu.php             # Settings screen
```

The PHP pages read cookies to keep minimal state. JavaScript loads translations and resources, then calls `generateStory` in `src/storyGenerator.js` to fetch a chapter from the OpenAI API (or fall back to text files). Player choices drive the chapter progression defined in `js/main.js`.
