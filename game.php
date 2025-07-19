<?php
session_start();

// Redirect if setup not completed
if (!isset($_COOKIE['hsd_language']) || !isset($_COOKIE['hsd_animal']) || !isset($_COOKIE['hsd_faction'])) {
    header('Location: index.php');
    exit;
}

$language = $_COOKIE['hsd_language'];
$animal = $_COOKIE['hsd_animal'];
$faction = $_COOKIE['hsd_faction'];
$inventory = json_decode($_COOKIE['hsd_inventory'] ?? '[]', true);
$gold = $_COOKIE['hsd_gold'] ?? 10;

// Handle game actions
if ($_POST && isset($_POST['action'])) {
    if ($_POST['action'] === 'add_item' && isset($_POST['item'])) {
        $inventory[] = $_POST['item'];
        setcookie('hsd_inventory', json_encode($inventory), time() + (10 * 365 * 24 * 60 * 60), '/');
    } elseif ($_POST['action'] === 'remove_item' && isset($_POST['index'])) {
        $index = (int)$_POST['index'];
        if (isset($inventory[$index])) {
            array_splice($inventory, $index, 1);
            setcookie('hsd_inventory', json_encode($inventory), time() + (10 * 365 * 24 * 60 * 60), '/');
        }
    } elseif ($_POST['action'] === 'reorder_inventory' && isset($_POST['inventory'])) {
        $newInventory = json_decode($_POST['inventory'], true);
        if (is_array($newInventory)) {
            setcookie('hsd_inventory', json_encode($newInventory), time() + (10 * 365 * 24 * 60 * 60), '/');
        }
    } elseif ($_POST['action'] === 'update_gold' && isset($_POST['gold'])) {
        $newGold = max(0, (int)$_POST['gold']);
        setcookie('hsd_gold', $newGold, time() + (10 * 365 * 24 * 60 * 60), '/');
        
        // Also handle inventory update in the same request if present
        if (isset($_POST['inventory'])) {
            $newInventory = json_decode($_POST['inventory'], true);
            if (is_array($newInventory)) {
                setcookie('hsd_inventory', json_encode($newInventory), time() + (10 * 365 * 24 * 60 * 60), '/');
            }
        }
    } elseif ($_POST['action'] === 'reset_character') {
        setcookie('hsd_animal', 'frog', time() + (10 * 365 * 24 * 60 * 60), '/');
        setcookie('hsd_inventory', '[]', time() + (10 * 365 * 24 * 60 * 60), '/');
        setcookie('hsd_gold', '10', time() + (10 * 365 * 24 * 60 * 60), '/');
    }
    
    header('Location: game.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hic Sunt Dracones - Adventure</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body class="game-body">
    <!-- Top Navigation -->
    <nav class="top-nav">
        <div class="nav-left">
            <a id="settingsLink" href="menu.php" class="nav-icon" title="Settings" data-tooltip="settings_tooltip">
                <div class="icon-circle">⚙️</div>
            </a>
        </div>
        <div class="nav-right">
            <select id="languageSwitch" onchange="changeLanguage(this.value)">
                <option value="spanish" <?php echo $language === 'spanish' ? 'selected' : ''; ?>>🇪🇸 ES</option>
                <option value="french" <?php echo $language === 'french' ? 'selected' : ''; ?>>🇫🇷 FR</option>
            </select>
        </div>
    </nav>

    <!-- Main Game Content -->
    <main class="game-main">
        <div class="story-section">
            <div class="story-text" id="storyText">
                <!-- Story content will be loaded by JavaScript -->
            </div>
            
            <div class="game-options" id="gameOptions">
                <!-- Options will be loaded by JavaScript -->
            </div>
        </div>
    </main>

    <!-- Bottom UI -->
    <footer class="game-footer">
        <div class="footer-left">
            <a id="feedbackLink" href="mailto:hi@tramann-projects.com" class="nav-icon" title="Feedback" data-tooltip="feedback_tooltip">
                <div class="icon-circle">✉️</div>
            </a>
        </div>
        
        <div class="inventory-section">
            <div class="inventory-slots" id="inventorySlots">
                <!-- Inventory will be populated by JavaScript -->
            </div>
        </div>
    </footer>

    <script type="module" src="js/main.js"></script>
    <script>
        window.currentLanguage = '<?php echo $language; ?>';
        window.playerAnimal = '<?php echo $animal; ?>';
        window.playerFaction = '<?php echo $faction; ?>';
        window.inventory = <?php echo json_encode($inventory); ?>;
        window.playerGold = <?php echo $gold; ?>;
    </script>
</body>
</html>
