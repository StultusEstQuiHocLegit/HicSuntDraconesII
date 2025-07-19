<?php
session_start();

// Check if user has completed setup
if (isset($_COOKIE['hsd_language']) && isset($_COOKIE['hsd_animal']) && isset($_COOKIE['hsd_faction'])) {
    header('Location: game.php');
    exit;
}

// Handle form submission
if ($_POST) {
    if (isset($_POST['language'])) {
        setcookie('hsd_language', $_POST['language'], time() + (10 * 365 * 24 * 60 * 60), '/'); // 10 years
        $_COOKIE['hsd_language'] = $_POST['language'];
    }
    
    if (isset($_POST['animal']) && isset($_POST['faction']) && !empty($_POST['animal'])) {
        setcookie('hsd_animal', $_POST['animal'], time() + (10 * 365 * 24 * 60 * 60), '/');
        setcookie('hsd_faction', $_POST['faction'], time() + (10 * 365 * 24 * 60 * 60), '/');
        setcookie('hsd_inventory', '[]', time() + (10 * 365 * 24 * 60 * 60), '/');
        
        header('Location: game.php');
        exit;
    }
}

$current_language = $_COOKIE['hsd_language'] ?? 'english';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hic Sunt Dracones - Character Creation</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="book-header">
            <h1 class="title">HIC SUNT DRACONES</h1>
            <p class="subtitle">A LANGUAGE LEARNING ADVENTURE</p>
        </header>

        <main class="setup-content">
            <?php if (!isset($_COOKIE['hsd_language'])): ?>
                <!-- Language Selection Step -->
                <div class="setup-step">
                    <h2 data-translate="choose_language">Choose Your Learning Language</h2>
                    <p class="hint" data-translate="hover_hint">Hover over words to see their translation</p>
                    
                    <form method="POST" class="language-form">
                        <div class="language-options">
                            <button type="submit" name="language" value="spanish" class="language-btn">
                                <span class="flag">🇪🇸</span>
                                <span data-translate="spanish">SPANISH</span>
                            </button>
                            <button type="submit" name="language" value="french" class="language-btn">
                                <span class="flag">🇫🇷</span>
                                <span data-translate="french">FRENCH</span>
                            </button>
                        </div>
                    </form>
                </div>
            <?php else: ?>
                <!-- Animal & Faction Selection Step -->
                <div class="setup-step">
                    <h2 data-translate="choose_character">Choose Your Character</h2>
                    
                    <form method="POST" class="character-form">
                        <div class="animal-selection">
                            <h3 data-translate="select_animal">Select Your Animal Companion</h3>
                            <div class="animals-grid" id="animalsGrid">
                                <!-- Animals will be loaded by JavaScript -->
                            </div>
                        </div>

                        <div class="stats-display" id="statsDisplay">
                            <!-- Stats will be shown here -->
                        </div>

                        <div class="faction-selection">
                            <h3 data-translate="choose_faction">Choose Your Faction</h3>
                            <div class="faction-options">
                                <label class="faction-option">
                                    <input type="radio" name="faction" value="merenau" required>
                                    <span class="faction-name" data-translate="league_merenau">LEAGUE OF MERENAU</span>
                                    <span class="faction-desc" data-translate="merenau_desc">Noble warriors of the eastern realms</span>
                                </label>
                                <label class="faction-option">
                                    <input type="radio" name="faction" value="kellfurt" required>
                                    <span class="faction-name" data-translate="kellfurt_alliance">KELLFURT ALLIANCE</span>
                                    <span class="faction-desc" data-translate="kellfurt_desc">Merchant guild of the northern territories</span>
                                </label>
                                <label class="faction-option">
                                    <input type="radio" name="faction" value="independent" required>
                                    <span class="faction-name" data-translate="independent">INDEPENDENT/OTHER</span>
                                    <span class="faction-desc" data-translate="independent_desc">Forge your own path</span>
                                </label>
                            </div>
                        </div>

                        <input type="hidden" name="animal" id="selectedAnimal" value="" required>
                        <button type="submit" class="start-btn" data-translate="start_adventure" onclick="return validateForm()">START ADVENTURE</button>
                    </form>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script src="js/main.js"></script>
    <script>
        window.currentLanguage = '<?php echo $current_language; ?>';
        if (window.currentLanguage !== 'english') {
            loadTranslations();
        }
        if (document.getElementById('animalsGrid')) {
            loadAnimals();
        }
        
        // Form validation
        function validateForm() {
            const animalInput = document.getElementById('selectedAnimal');
            const factionInput = document.querySelector('input[name="faction"]:checked');
            
            if (!animalInput || !animalInput.value) {
                alert('Please select an animal companion!');
                return false;
            }
            
            if (!factionInput) {
                alert('Please choose a faction!');
                return false;
            }
            
            return true;
        }
    </script>
</body>
</html>
