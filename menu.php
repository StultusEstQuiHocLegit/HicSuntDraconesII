<?php
session_start();

// Handle form submission
if ($_POST) {
    if (isset($_POST['animal'])) {
        setcookie('hsd_animal', $_POST['animal'], time() + (10 * 365 * 24 * 60 * 60), '/');
    }
    if (isset($_POST['faction'])) {
        setcookie('hsd_faction', $_POST['faction'], time() + (10 * 365 * 24 * 60 * 60), '/');
    }
    if (isset($_POST['language'])) {
        setcookie('hsd_language', $_POST['language'], time() + (10 * 365 * 24 * 60 * 60), '/');
    }
    if (isset($_POST['reset'])) {
        setcookie('hsd_language', '', time() - 3600, '/');
        setcookie('hsd_animal', '', time() - 3600, '/');
        setcookie('hsd_faction', '', time() - 3600, '/');
        setcookie('hsd_inventory', '', time() - 3600, '/');
        header('Location: index.php');
        exit;
    }
    
    header('Location: game.php');
    exit;
}

$language = $_COOKIE['hsd_language'] ?? 'english';
$animal = $_COOKIE['hsd_animal'] ?? '';
$faction = $_COOKIE['hsd_faction'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hic Sunt Dracones - Settings</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="book-header">
            <h1 class="title" data-translate="settings" title="Settings">SETTINGS</h1>
            <a href="game.php" class="back-link" data-translate="back_to_game">← BACK TO ADVENTURE</a>
        </header>

        <main class="setup-content">
            <form method="POST" class="settings-form">
                <div class="setting-group">
                    <h3 data-translate="language_settings">Language Settings</h3>
                    <select name="language" class="setting-select">
                        <option value="spanish" <?php echo $language === 'spanish' ? 'selected' : ''; ?> data-translate="spanish">Spanish</option>
                        <option value="french" <?php echo $language === 'french' ? 'selected' : ''; ?> data-translate="french">French</option>
                    </select>
                </div>

                <div class="setting-group">
                    <h3 data-translate="character_settings">Character Settings</h3>
                    <div class="current-animal" id="currentAnimal">
                        <!-- Current animal will be loaded by JavaScript -->
                    </div>
                    <div class="animals-grid small" id="animalsGridMenu">
                        <!-- Animals will be loaded by JavaScript -->
                    </div>
                </div>

                <div class="setting-group">
                    <h3 data-translate="faction_settings">Faction Settings</h3>
                    <select name="faction" class="setting-select">
                        <option value="merenau" <?php echo $faction === 'merenau' ? 'selected' : ''; ?> data-translate="league_merenau">League of Merenau</option>
                        <option value="kellfurt" <?php echo $faction === 'kellfurt' ? 'selected' : ''; ?> data-translate="kellfurt_alliance">Kellfurt Alliance</option>
                        <option value="independent" <?php echo $faction === 'independent' ? 'selected' : ''; ?> data-translate="independent">Independent/Other</option>
                    </select>
                </div>

                <div class="settings-actions">
                    <button type="submit" class="save-btn" data-translate="save_settings">SAVE SETTINGS</button>
                    <button type="submit" name="reset" value="1" class="reset-btn" data-translate="reset_character" onclick="return confirmReset()">RESET CHARACTER</button>
                </div>
            </form>
        </main>
    </div>

    <script type="module" src="js/main.js"></script>
    <script>
        window.currentLanguage = '<?php echo $language; ?>';
        window.currentAnimal = '<?php echo $animal; ?>';
        
        document.addEventListener('DOMContentLoaded', function() {
            loadTranslations();
            loadAnimalsForMenu();
        });
    </script>
</body>
</html>
