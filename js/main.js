// Global variables
let translations = {};
let animals = {};
let ipdk = {};
let currentStory = {};

// Read window variables set by PHP
const currentLanguage = window.currentLanguage;
const playerAnimal = window.playerAnimal;
const playerFaction = window.playerFaction;
const inventory = window.inventory;
const playerGold = window.playerGold;

document.addEventListener('DOMContentLoaded', async function() {
    if (document.getElementById('storyText')) {
        await loadAnimalsForGame();
        await loadItems();
        await loadTranslations();
        const langChanged = localStorage.getItem('languageChangedTo');
        if (langChanged) {
            const langName = translations[langChanged] || langChanged;
            const template = translations['language_switched'] ||
                'Language switched. Future stories will be generated in {language}.';
            showGameMessage(template.replace('{language}', langName));
            localStorage.removeItem('languageChangedTo');
        }
        initializeStory();
        setupKeyboardNavigation();
        setupInventory();
        createDropZone();
    }
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
});

import { generateStory, saveChoice } from '../src/storyGenerator.js';

const chapterTypeMap = {
    combat: 'combat',
    crafting: 'crafting',
    dialogue: 'dialogue',
    trader: 'trading',
    puzzle: 'puzzle',
    minigame: 'minigame',
    wordquiz: 'wordquiz'
};

function detectOptionType(option) {
    const text = option.toLowerCase();
    if (/combat|battle|fight|training/.test(text)) return 'combat';
    if (/trader|merchant|shop|trade/.test(text)) return 'trading';
    if (/puzzle|enigma|riddle/.test(text)) return 'puzzle';
    if (/dialogue|talk|speak|conversation/.test(text)) return 'dialogue';
    if (/craft|forge|smith/.test(text)) return 'crafting';
    if (/minigame|memory|challenge/.test(text)) return 'minigame';
    if (/quiz/.test(text)) return 'wordquiz';
    return null;
}

const storyProgression = {
    'intro': {
        0: 'chapter1',
        1: 'mountain',
        2: 'village',
        3: 'village',
        4: 'combat',
        5: 'trader',
        6: 'minigame',
        7: 'wordquiz'
    },
    'chapter1': {
        0: 'combat',
        1: 'mountain',
        2: 'dialogue',
        3: 'crafting',
        4: 'trader'
    },
    'combat': {},
    'trader': {},
    'mountain': {
        0: 'combat',
        1: 'puzzle',
        2: 'village',
        3: () => { addRandomItem(); loadStoryContent('mountain'); },
        4: 'dialogue'
    },
    'village': {
        0: () => { addItem('🧿'); loadStoryContent('intro'); },
        1: 'crafting',
        2: () => { addRandomItem(); loadStoryContent('village'); },
        3: () => { addRandomItem(); loadStoryContent('village'); },
        4: 'dialogue',
        5: 'puzzle',
        6: 'chapter1'
    },
    'treasure': {
        0: () => { showGameMessage('¡Victory! Tu adventure continues...'); setTimeout(() => loadStoryContent('intro'), 2500); },
        1: () => { showGameMessage('New mysteries await...'); setTimeout(() => loadStoryContent('chapter1'), 2500); },
        2: () => { addItem('❤️'); showGameMessage('Your companion is grateful!'); setTimeout(() => loadStoryContent('intro'), 2500); },
        3: () => { showGameMessage('The adventure never ends...'); setTimeout(() => loadStoryContent('intro'), 2500); }
    }
};

function initializeStory() {
    const stored = JSON.parse(localStorage.getItem('storyContext') || '[]');
    if (stored.length > 0) {
        try {
            const last = stored[stored.length - 1];
            const text = typeof last === 'string' ? last : last.text;
            currentStory = JSON.parse(text);
            window.currentChapter = last.chapter || localStorage.getItem('currentChapter') || 'intro';
            displayStoryContent();
            return;
        } catch (e) {
            console.error('Failed to parse stored story', e);
        }
    }
    loadStoryContent('intro');
}

// Load translations for the current language
async function loadTranslations() {
    try {
        const response = await fetch(`translations/${window.currentLanguage}.json`);
        translations = await response.json();
        updateTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Update all translatable elements
function updateTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        const key = element.getAttribute('data-tooltip');
        if (translations[key]) {
            element.setAttribute('title', translations[key]);
        }
    });
}

// Load animal data
async function loadAnimals() {
    try {
        const response = await fetch('resources/animals.json');
        animals = await response.json();
        displayAnimals();
    } catch (error) {
        console.error('Error loading animals:', error);
    }
}

// Load animals data for game (without displaying grid)
async function loadAnimalsForGame() {
    try {
        const response = await fetch('resources/animals.json');
        animals = await response.json();
        // Validate player animal
        if (!animals[window.playerAnimal]) {
            console.warn('Player animal not found:', window.playerAnimal);
            window.playerAnimal = Object.keys(animals)[0];
        }
    } catch (error) {
        console.error('Error loading animals:', error);
    }
}

// Load item data
async function loadItems() {
    try {
        const response = await fetch('resources/items.json');
        ipdk = await response.json();
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

// Display animals in grid
function displayAnimals() {
    const grid = document.getElementById('animalsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    
    Object.keys(animals).forEach(animalKey => {
        const animal = animals[animalKey];
        const animalDiv = document.createElement('div');
        animalDiv.className = 'animal-option';
        animalDiv.setAttribute('data-animal', animalKey);
        animalDiv.onclick = () => selectAnimal(animalKey);
        
        animalDiv.innerHTML = `
            <span class="animal-emoji">${animal.emoji}</span>
            <span class="animal-name">${getAnimalName(animal)}</span>
        `;
        
        grid.appendChild(animalDiv);
    });
}

// Load animals for menu page
function loadAnimalsForMenu() {
    loadAnimals().then(() => {
        displayCurrentAnimal();
        displayAnimalsGrid();
    });
}

// Display current animal in menu
function displayCurrentAnimal() {
    const currentDiv = document.getElementById('currentAnimal');
    if (!currentDiv || !window.currentAnimal) return;

    const animal = animals[window.currentAnimal];
    if (animal) {
        currentDiv.innerHTML = `
            <div class="animal-option selected">
                <span class="animal-emoji">${animal.emoji}</span>
                <span class="animal-name">${getAnimalName(animal)}</span>
            </div>
            <div class="stats-display">
                ${displayStats(animal.stats)}
            </div>
        `;
    }
}

// Display animals grid in menu
function displayAnimalsGrid() {
    const grid = document.getElementById('animalsGridMenu');
    if (!grid) return;

    grid.innerHTML = '';
    
    Object.keys(animals).forEach(animalKey => {
        const animal = animals[animalKey];
        const animalDiv = document.createElement('div');
        animalDiv.className = 'animal-option';
        if (animalKey === window.currentAnimal) {
            animalDiv.classList.add('selected');
        }
        animalDiv.setAttribute('data-animal', animalKey);
        animalDiv.onclick = () => selectAnimalMenu(animalKey);
        
        animalDiv.innerHTML = `
            <span class="animal-emoji">${animal.emoji}</span>
            <span class="animal-name">${getAnimalName(animal)}</span>
        `;
        
        grid.appendChild(animalDiv);
    });
}

// Get animal name in current language
function getAnimalName(animal) {
    const currentLang = window.currentLanguage || 'english';
    return animal.names[currentLang] || animal.names.english;
}

// Select animal and show stats
function selectAnimal(animalKey) {
    // Remove previous selection
    document.querySelectorAll('.animal-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked animal
    document.querySelector(`[data-animal="${animalKey}"]`).classList.add('selected');
    
    // Update hidden input for form submission
    const input = document.getElementById('selectedAnimal');
    if (input) {
        input.value = animalKey;
    }
    
    // Display stats
    displayAnimalStats(animalKey);
}

// Select animal in menu
function selectAnimalMenu(animalKey) {
    // Remove previous selection
    document.querySelectorAll('#animalsGridMenu .animal-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked animal
    document.querySelector(`#animalsGridMenu [data-animal="${animalKey}"]`).classList.add('selected');
    
    // Update current animal display
    window.currentAnimal = animalKey;
    displayCurrentAnimal();
    
    // Update hidden input
    let input = document.querySelector('input[name="animal"]');
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'animal';
        document.querySelector('.settings-form').appendChild(input);
    }
    input.value = animalKey;
}

// Display animal stats
function displayAnimalStats(animalKey) {
    const statsDiv = document.getElementById('statsDisplay');
    if (!statsDiv) return;

    const animal = animals[animalKey];
    if (!animal) return;

    statsDiv.innerHTML = displayStats(animal.stats);
}

// Generate stats HTML
function displayStats(stats) {
    return `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label" data-translate="speed">Speed</div>
                <div class="stat-value">${stats.speed}</div>
                <div class="stat-bars">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="stat-bar ${i < stats.speed ? 'filled' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-label" data-translate="life">Life</div>
                <div class="stat-value">${stats.life}</div>
                <div class="stat-bars">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="stat-bar ${i < stats.life ? 'filled' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-label" data-translate="attack">Attack</div>
                <div class="stat-value">${stats.attack}</div>
                <div class="stat-bars">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="stat-bar ${i < stats.attack ? 'filled' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-label" data-translate="defense">Defense</div>
                <div class="stat-value">${stats.defense}</div>
                <div class="stat-bars">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="stat-bar ${i < stats.defense ? 'filled' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-label" data-translate="inventory">Inventory</div>
                <div class="stat-value">${stats.inventory}</div>
                <div class="stat-bars">
                    ${Array.from({length: 8}, (_, i) => 
                        `<div class="stat-bar ${i < stats.inventory ? 'filled' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

// Change language
function changeLanguage(newLanguage) {
    localStorage.setItem('languageChangedTo', newLanguage);
    document.cookie = `hsd_language=${newLanguage}; expires=${new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    location.reload();
}

function showLoading() {
    let spinner = document.getElementById('loading-spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.style = 'display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.7);z-index:9999;';
        spinner.innerHTML = `<div style="border:8px solid #f3f3f3;border-top:8px solid #3498db;border-radius:50%;width:60px;height:60px;animation:spin 1s linear infinite;"></div>
        <style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>`;
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
}

// Load story content
async function loadStoryContent(userInput = 'intro') {
    showLoading();
    try {
        const aiStory = await generateStory(userInput, currentLanguage);
        // Fix: Only parse if it's a string
        if (typeof aiStory === 'string') {
            currentStory = JSON.parse(aiStory);
        } else {
            currentStory = aiStory;
        }
        window.currentChapter = userInput;
        displayStoryContent();
    } catch (error) {
        console.error('Error generating story content:', error);
        if (userInput !== 'intro') {
            loadStoryContent('intro');
        }
    } finally {
        hideLoading();
    }
}

function restorePreviousStory() {
    const stored = JSON.parse(localStorage.getItem('storyContext') || '[]');

    // Remove the last entry (the current special interaction)
    if (stored.length > 0) {
        stored.pop();
        localStorage.setItem('storyContext', JSON.stringify(stored));
    }

    if (stored.length > 0) {
        try {
            const prev = stored[stored.length - 1];
            const text = typeof prev === 'string' ? prev : prev.text;
            currentStory = JSON.parse(text);
            window.currentChapter = prev.chapter || localStorage.getItem('currentChapter') || 'intro';
            displayStoryContent();
            return;
        } catch (e) {
            console.error('Failed to restore story', e);
        }
    }

    loadStoryContent('intro');
}

// Display story content with translations
function displayStoryContent() {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');

    if (!storyDiv || !optionsDiv) return;

    const currentLang = window.currentLanguage || 'spanish';
    const storyData = (currentStory && (currentStory[currentLang] || currentStory.spanish)) || null;

    // If no story data exists yet, try loading the intro chapter
    if (!storyData) {
        console.warn('No story data found, generating intro.');
        loadStoryContent('intro');
        return;
    }

    // Check if this is a special interaction type
    if (storyData.type === 'combat') {
        displayCombatInterface(storyData);
        return;
    } else if (storyData.type === 'trading') {
        displayTradingInterface(storyData);
        return;
    } else if (storyData.type === 'puzzle') {
        displayPuzzle(storyData);
        return;
    } else if (storyData.type === 'dialogue') {
        displayDialogue(storyData);
        return;
    } else if (storyData.type === 'crafting') {
        displayCrafting(storyData);
        return;
    } else if (storyData.type === 'minigame') {
        displayMinigame(storyData);
        return;
    } else if (storyData.type === 'wordquiz') {
        displayWordQuiz(storyData);
        return;
    }

    // Display story text with hover translations
    let storyHTML = storyData.text;
    
    // Add translation spans to words
    if (translations && Object.keys(translations).length > 0) {
        const replaced = new Set();
        Object.keys(translations).forEach(key => {
            const word = translations[key];
            if (replaced.has(word)) return;
            if (word.length <= 5) return; // only process words longer than 5 characters, otherwiese we get errors in the message itself
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            storyHTML = storyHTML.replace(regex,
                `<span class="translatable" data-word="${key}">${word}<span class="translation-tooltip">${key}</span></span>`
            );
            replaced.add(word);
        });
    }
    
    storyDiv.innerHTML = storyHTML;
    displayStoryContentWithAnimation();

    // Display options
    if (storyData.options) {
        const currentChapterName = window.currentChapter || 'intro';
        const progression = storyProgression[currentChapterName] || {};

        const optionsHTML = storyData.options.map((option, index) => {
            const next = progression[index];
            let typeKey = typeof next === 'string' ? chapterTypeMap[next] : null;
            if (!typeKey) {
                typeKey = detectOptionType(option);
            }
            const tooltip = translations[typeKey] || translations['continue_story'] || 'continue';
            const specialClass = typeKey ? ' special' : '';
            return `
                <div class="option-item${specialClass}" onclick="selectOption(${index})" data-key="${index}" title="${tooltip}">
                    <span class="option-number">${index}</span>
                    <span class="option-text">${option}</span>
                </div>
            `;
        }).join('');

        optionsDiv.innerHTML = optionsHTML;
    }
}

// Setup keyboard navigation for options
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Handle combat controls
        if (window.currentCombat) {
            if (key === '1') {
                combatAction('attack');
                event.preventDefault();
                return;
            } else if (key === '2') {
                combatAction('defend');
                event.preventDefault();
                return;
            } else if (key === '0') {
                combatAction('flee');
                event.preventDefault();
                return;
            }
        }
        
        // Handle memory game controls
        const memoryGame = document.querySelector('.memory-matching-game');
        if (memoryGame) {
            // Handle number keys for left side (1-5)
            if (key >= '1' && key <= '5') {
                const index = parseInt(key) - 1;
                const leftWords = memoryGame.querySelectorAll('.memory-word-left');
                if (index < leftWords.length && !leftWords[index].classList.contains('matched')) {
                    selectLeftWord(index);
                    event.preventDefault();
                    return;
                }
            }
            
            // Handle letter keys for right side (A-E)
            const keyCode = key.toUpperCase().charCodeAt(0);
            if (keyCode >= 65 && keyCode <= 69) { // A-E
                const index = keyCode - 65; // A=0, B=1, etc.
                const rightWords = memoryGame.querySelectorAll('.memory-word-right');
                if (index < rightWords.length && !rightWords[index].classList.contains('matched')) {
                    const english = rightWords[index].getAttribute('data-english');
                    selectRightWord(english);
                    event.preventDefault();
                    return;
                }
            }
            
            // Handle 0 for leaving memory game
            if (key === '0') {
                leaveMinigame();
                event.preventDefault();
                return;
            }
        }

        // Handle word quiz controls
        const wordQuiz = document.querySelector('.word-quiz-interface');
        if (wordQuiz) {
            if (key >= '1' && key <= '6') {
                const index = parseInt(key) - 1;
                const options = wordQuiz.querySelectorAll('.quiz-option');
                if (index < options.length) {
                    const word = options[index].getAttribute('data-word');
                    selectQuizOption(word);
                    event.preventDefault();
                    return;
                }
            }

            if (key === '0') {
                leaveWordQuiz();
                event.preventDefault();
                return;
            }
        }

        // Handle dialogue options (number keys)
        const dialogueInterface = document.querySelector('.dialogue-interface');
        if (dialogueInterface) {
            if (key >= '1' && key <= '9') {
                const idx = parseInt(key) - 1;
                const options = document.querySelectorAll('.story-option');
                if (idx < options.length - 1) { // last is leave
                    options[idx].click();
                    event.preventDefault();
                    return;
                }
            }
            // 0 for leave
            if (key === '0') {
                const options = document.querySelectorAll('.story-option');
                if (options.length > 0) {
                    options[options.length - 1].click();
                    event.preventDefault();
                    return;
                }
            }
        }
        
        // Handle crafting controls
        const craftingInterface = document.querySelector('.crafting-interface');
        if (craftingInterface) {
            // Handle number keys for crafting (1-3)
            if (key >= '1' && key <= '3') {
                const craftButtons = craftingInterface.querySelectorAll('.combat-btn:not([disabled])');
                const index = parseInt(key) - 1;
                if (index < craftButtons.length - 1) { // -1 to exclude the leave button
                    craftButtons[index].click();
                    event.preventDefault();
                    return;
                }
            }
            
            // Handle 0 for leaving crafting
            if (key === '0') {
                leaveCrafting();
                event.preventDefault();
                return;
            }
        }
        
        // Handle trader controls
        const tradingInterface = document.querySelector('.trading-interface');
        if (tradingInterface) {
            // Handle number keys for buying (1-9)
            if (key >= '1' && key <= '9') {
                const buyButtons = tradingInterface.querySelectorAll('.shop-items .combat-btn:not([disabled])');
                const index = parseInt(key) - 1;
                if (index < buyButtons.length) {
                    buyButtons[index].click();
                    event.preventDefault();
                    return;
                }
            }
            
            // Handle letter keys for selling (A-Z)
            const keyCode = key.toUpperCase().charCodeAt(0);
            if (keyCode >= 65 && keyCode <= 90) { // A-Z
                const sellButtons = tradingInterface.querySelectorAll('.sell-items .sell-btn');
                const index = keyCode - 65; // A=0, B=1, etc.
                if (index < sellButtons.length) {
                    sellButtons[index].click();
                    event.preventDefault();
                    return;
                }
            }
            
            // Handle 0 for leaving trader
            if (key === '0') {
                const leaveButton = tradingInterface.querySelector('button[onclick="leaveTrade()"]');
                if (leaveButton) {
                    leaveButton.click();
                    event.preventDefault();
                    return;
                }
            }
        }
        
        // Handle regular story options
        if (key >= '0' && key <= '9') {
            const optionIndex = parseInt(key);
            selectOption(optionIndex);
        }
    });
}

// Select game option
function selectOption(index) {
    const options = document.querySelectorAll('.option-item');
    if (index < options.length) {
        const option = options[index];
        option.style.background = 'rgba(74, 158, 255, 0.4)';
        
        setTimeout(() => {
            option.style.background = '';
            handleStoryChoice(index);
        }, 200);
    }
}
window.selectOption = selectOption;

// Expose language switcher for inline handlers
window.changeLanguage = changeLanguage;

window.combatAction = combatAction;
window.buyItem = buyItem;
window.sellItem = sellItem;
window.leaveTrade = leaveTrade;
window.checkPuzzleAnswer = checkPuzzleAnswer;
window.showPuzzleHint = showPuzzleHint;
window.leavePuzzle = leavePuzzle;
window.selectDialogueResponse = selectDialogueResponse;
window.leaveDialogue = leaveDialogue;
window.craftItem = craftItem;
window.leaveCrafting = leaveCrafting;
window.leaveMinigame = leaveMinigame;
window.selectLeftWord = selectLeftWord;
window.selectRightWord = selectRightWord;
window.selectQuizOption = selectQuizOption;
window.leaveWordQuiz = leaveWordQuiz;

// Handle story progression based on choices
function handleStoryChoice(choiceIndex) {
    const currentChapter = window.currentChapter || 'intro';
    const currentLang = window.currentLanguage || 'spanish';

    // Save player's choice text for context
    const storyData = currentStory[currentLang] || currentStory.spanish;
    if (storyData && storyData.options && storyData.options[choiceIndex]) {
        saveChoice(storyData.options[choiceIndex]);
    }

    // Define story progression logic
    const progression = storyProgression[currentChapter];
    if (progression && progression[choiceIndex] !== undefined) {
        const next = progression[choiceIndex];
        if (typeof next === 'function') {
            next();
        } else {
            loadStoryContent(next);
        }
    } else {
        // Default action - show a message and stay on same chapter
        showGameMessage("Your choice echoes through the realm...");
        setTimeout(() => loadStoryContent(currentChapter), 1500);
    }
}

// Add random item to inventory
function addRandomItem() {
    const items = Object.keys(ipdk);
    if (items.length === 0) return;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    addItem(randomItem);
}

// Show game message
function showGameMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'game-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, 2000);
}

// Show game message that requires user to close it
function showClosableMessage(message, onClose) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'game-message closable';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'message-close-btn';
    closeBtn.textContent = 'X';
    closeBtn.title = translations['close'] || 'Close';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message;

    messageDiv.appendChild(closeBtn);
    messageDiv.appendChild(textDiv);
    document.body.appendChild(messageDiv);

    function cleanup() {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
        document.removeEventListener('keydown', onKeydown);
        if (typeof onClose === 'function') onClose();
    }

    function onKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            cleanup();
        }
    }

    closeBtn.addEventListener('click', cleanup);
    document.addEventListener('keydown', onKeydown);

    closeBtn.focus();
}

// Confirmation dialog for resetting character
function confirmReset() {
    return confirm(translations['confirm_reset_character'] || 'Are you sure you want to reset your character?');
}

// Enhanced story display with animations
function displayStoryContentWithAnimation() {
    const storyDiv = document.getElementById('storyText');
    if (storyDiv) {
        storyDiv.classList.add('fade-in');
        setTimeout(() => {
            storyDiv.classList.remove('fade-in');
        }, 800);
    }
}

// Inventory management
function useItem(index) {
    if (confirm(translations['use_item_question'] || 'Use this item?')) {
        // Remove item from inventory
        const form = document.createElement('form');
        form.method = 'POST';
        form.style.display = 'none';
        
        const actionInput = document.createElement('input');
        actionInput.name = 'action';
        actionInput.value = 'remove_item';
        
        const indexInput = document.createElement('input');
        indexInput.name = 'index';
        indexInput.value = index;
        
        form.appendChild(actionInput);
        form.appendChild(indexInput);
        document.body.appendChild(form);
        form.submit();
    }
}

// Add item to inventory (for game logic)
function addItem(item) {
    if (window.inventory.length >= window.maxInventorySlots) {
        showGameMessage(translations['inventory_full_drop'] || 'Inventory is full! You need to use or drop an item first.');
        return false;
    }
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    const actionInput = document.createElement('input');
    actionInput.name = 'action';
    actionInput.value = 'add_item';
    
    const itemInput = document.createElement('input');
    itemInput.name = 'item';
    itemInput.value = item;
    
    form.appendChild(actionInput);
    form.appendChild(itemInput);
    document.body.appendChild(form);
    form.submit();
    return true;
}

// Create tooltip for inventory items
function createItemTooltip(item) {
    const tooltip = document.createElement('div');
    tooltip.className = 'inventory-tooltip';
    
    const currentLang = window.currentLanguage || 'spanish';
    const description = ipdk[item];
    
    if (description) {
        const localName = description[currentLang] || description.spanish;
        const englishName = description.english;
        
        tooltip.innerHTML = `
            <div class="tooltip-name">${localName}</div>
            ${currentLang !== 'english' ? `<div class="tooltip-translation">(${englishName})</div>` : ''}
        `;
    } else {
        // Fallback for unknown items
        const name = translations['mysterious_object'] || 'Mysterious object';
        tooltip.innerHTML = `<div class="tooltip-name">${name}</div>`;
    }
    
    return tooltip;
}

// Setup inventory system with drag and drop
function setupInventory() {
    const inventorySlots = document.getElementById('inventorySlots');
    if (!inventorySlots) return;
    
    updateInventoryDisplay();
}

// Update inventory display
function updateInventoryDisplay() {
    const inventorySlots = document.getElementById('inventorySlots');
    if (!inventorySlots) return;

    // Check if animals data is loaded
    if (!animals || !animals[window.playerAnimal]) {
        console.log('Animals data not loaded, using default inventory size');
        // Use a default inventory size if animals data isn't loaded
        const maxSlots = 5; // default
        const currentInventory = window.inventory || [];
        
        inventorySlots.innerHTML = '';
        
        for (let i = 0; i < maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = i < currentInventory.length ? 'inventory-item' : 'inventory-slot empty';
            slot.setAttribute('data-index', i);
            
            if (i < currentInventory.length) {
                slot.textContent = currentInventory[i];
                slot.onclick = () => useItem(i);
                setupDragAndDrop(slot, i);
            }
            
            setupDropTarget(slot, i);
            inventorySlots.appendChild(slot);
        }
        return;
    }
    
    const animalData = animals[window.playerAnimal];
    const maxSlots = animalData.stats.inventory;
    const currentInventory = window.inventory || [];
    
    inventorySlots.innerHTML = '';
    
    // Create slots based on animal's inventory capacity
    for (let i = 0; i < maxSlots; i++) {
        const slot = document.createElement('div');
        slot.className = i < currentInventory.length ? 'inventory-item' : 'inventory-slot empty';
        slot.setAttribute('data-index', i);
        
        if (i < currentInventory.length) {
            const item = currentInventory[i];
            slot.textContent = item;
            slot.onclick = () => useItem(i);
            
            // Add tooltip with item explanation
            const tooltip = createItemTooltip(item);
            slot.appendChild(tooltip);
            
            setupDragAndDrop(slot, i);
        }
        
        setupDropTarget(slot, i);
        inventorySlots.appendChild(slot);
    }
}

// Setup drag and drop for inventory items
function setupDragAndDrop(element, index) {
    element.draggable = true;
    
    element.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', index);
        element.classList.add('dragging');
        document.querySelector('.drop-zone').classList.add('active');
    });
    
    element.addEventListener('dragend', function(e) {
        element.classList.remove('dragging');
        document.querySelector('.drop-zone').classList.remove('active');
    });
}

// Setup drop targets for inventory slots
function setupDropTarget(element, index) {
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        element.classList.add('drag-over');
    });
    
    element.addEventListener('dragleave', function(e) {
        element.classList.remove('drag-over');
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        element.classList.remove('drag-over');
        
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = index;
        
        if (fromIndex !== toIndex) {
            reorderInventory(fromIndex, toIndex);
        }
    });
}

// Create drop zone for removing items
function createDropZone() {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.textContent = translations['drop_here'] || 'Drop here to remove item';
    document.body.appendChild(dropZone);
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        const index = parseInt(e.dataTransfer.getData('text/plain'));
        
        if (confirm(translations['confirm_remove_item'] || 'Remove this item from inventory?')) {
            removeInventoryItem(index);
        }
        
        dropZone.classList.remove('active');
    });
}

// Reorder inventory items
function reorderInventory(fromIndex, toIndex) {
    const newInventory = [...window.inventory];
    const item = newInventory.splice(fromIndex, 1)[0];
    newInventory.splice(toIndex, 0, item);
    
    // Update inventory
    window.inventory = newInventory;
    updateInventoryViaForm(newInventory);
}

// Remove inventory item
function removeInventoryItem(index) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    const actionInput = document.createElement('input');
    actionInput.name = 'action';
    actionInput.value = 'remove_item';
    
    const indexInput = document.createElement('input');
    indexInput.name = 'index';
    indexInput.value = index;
    
    form.appendChild(actionInput);
    form.appendChild(indexInput);
    document.body.appendChild(form);
    form.submit();
}

// Update inventory via form submission
function updateInventoryViaForm(newInventory) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    const actionInput = document.createElement('input');
    actionInput.name = 'action';
    actionInput.value = 'reorder_inventory';
    
    const inventoryInput = document.createElement('input');
    inventoryInput.name = 'inventory';
    inventoryInput.value = JSON.stringify(newInventory);
    
    form.appendChild(actionInput);
    form.appendChild(inventoryInput);
    document.body.appendChild(form);
    form.submit();
}

// Combat system
function displayCombatInterface(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    // Wait for animals data to be loaded
    if (!animals || !animals[window.playerAnimal]) {
        setTimeout(() => displayCombatInterface(storyData), 100);
        return;
    }
    
    if (!window.currentCombat) {
        // Initialize combat
        const enemyName = storyData.enemy || 'wolf';
        let enemyData = animals[enemyName];
        let playerData = animals[window.playerAnimal];

        // Fallback if enemy or player data is missing
        if (!enemyData) {
            console.warn('Enemy data not found:', enemyName, '- defaulting to wolf');
            enemyData = animals['wolf'] || Object.values(animals)[0];
        }
        if (!playerData) {
            console.warn('Player data not found:', window.playerAnimal, '- defaulting to first animal');
            window.playerAnimal = Object.keys(animals)[0];
            playerData = animals[window.playerAnimal];
        }
        
        window.currentCombat = {
            player: {
                name: window.playerAnimal,
                health: playerData.stats.life * 10,
                maxHealth: playerData.stats.life * 10,
                stats: playerData.stats,
                emoji: playerData.emoji
            },
            enemy: {
                name: enemyName,
                health: enemyData.stats.life * 10,
                maxHealth: enemyData.stats.life * 10,
                stats: enemyData.stats,
                emoji: enemyData.emoji
            }
        };
    }
    
    const combat = window.currentCombat;
    
    storyDiv.innerHTML = `
        <div class="combat-interface">
            <h3>${translations['combat'] || 'COMBAT!'}</h3>
            <div class="combat-stats">
                <div class="combatant">
                    <div class="combatant-name">${combat.player.name.toUpperCase()}</div>
                    <div class="combatant-emoji">${combat.player.emoji}</div>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${(combat.player.health / combat.player.maxHealth) * 100}%"></div>
                    </div>
                    <div>${translations['hp'] || 'HP:'} ${combat.player.health}/${combat.player.maxHealth}</div>
                </div>
                <div class="combatant enemy">
                    <div class="combatant-name">${combat.enemy.name.toUpperCase()}</div>
                    <div class="combatant-emoji">${combat.enemy.emoji}</div>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${(combat.enemy.health / combat.enemy.maxHealth) * 100}%"></div>
                    </div>
                    <div>${translations['hp'] || 'HP:'} ${combat.enemy.health}/${combat.enemy.maxHealth}</div>
                </div>
            </div>
            <div class="combat-actions">
                <button class="combat-btn" onclick="combatAction('attack')">
                    <span class="key-indicator">1</span>
                    ${translations['attack'] || 'ATTACK'}
                </button>
                <button class="combat-btn" onclick="combatAction('defend')">
                    <span class="key-indicator">2</span>
                    ${translations['defend'] || 'DEFEND'}
                </button>
                <button class="combat-btn" onclick="combatAction('flee')">
                    <span class="key-indicator">0</span>
                    ${translations['flee'] || 'FLEE'}
                </button>
            </div>
        </div>
    `;
    
    optionsDiv.innerHTML = '';
}

// Handle combat actions
function combatAction(action) {
    const combat = window.currentCombat;
    let message = '';
    
    if (action === 'attack') {
        const damage = Math.max(1, combat.player.stats.attack + Math.floor(Math.random() * 5) - combat.enemy.stats.defense);
        combat.enemy.health = Math.max(0, combat.enemy.health - damage);
        message = (translations['player_deal_damage'] || 'You deal {damage} damage!').replace('{damage}', damage);
    } else if (action === 'defend') {
        message = translations['brace_enemy_attack'] || 'You brace for the enemy attack!';
    } else if (action === 'flee') {
        showGameMessage(translations['fled_combat'] || 'You fled from combat!');
        window.currentCombat = null;
        setTimeout(() => restorePreviousStory(), 1500);
        return;
    }
    
    // Check if enemy defeated
    if (combat.enemy.health <= 0) {
        showGameMessage(translations['victory_defeated_enemy'] || 'Victory! You defeated the enemy!');
        addRandomItem();
        window.currentCombat = null;
        setTimeout(() => restorePreviousStory(), 2000);
        return;
    }
    
    // Enemy turn
    const enemyDamage = Math.max(1, combat.enemy.stats.attack + Math.floor(Math.random() * 5) - combat.player.stats.defense);
    if (action !== 'defend') {
        combat.player.health = Math.max(0, combat.player.health - enemyDamage);
        message += ' ' + (translations['enemy_deals_damage'] || 'Enemy deals {damage} damage!').replace('{damage}', enemyDamage);
    } else {
        const reducedDamage = Math.max(1, Math.floor(enemyDamage / 2));
        combat.player.health = Math.max(0, combat.player.health - reducedDamage);
        message += ' ' + (translations['enemy_deals_reduced'] || 'Enemy deals {damage} damage (reduced)!').replace('{damage}', reducedDamage);
    }
    
    // Check if player defeated
    if (combat.player.health <= 0) {
        showGameMessage(translations['player_defeated'] || 'You were defeated! Returning as a frog...');
        
        // Reset character as frog
        const form = document.createElement('form');
        form.method = 'POST';
        form.style.display = 'none';
        
        const actionInput = document.createElement('input');
        actionInput.name = 'action';
        actionInput.value = 'reset_character';
        
        form.appendChild(actionInput);
        document.body.appendChild(form);
        form.submit();
        return;
    }
    
    showGameMessage(message);
    setTimeout(() => {
        displayStoryContent();
    }, 1500);
}

// Trading system
function displayTradingInterface(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    const shopItems = [
        { emoji: '⚔️', basePrice: 15 },
        { emoji: '🛡️', basePrice: 12 },
        { emoji: '🧿', basePrice: 8 },
        { emoji: '🔮', basePrice: 20 },
        { emoji: '📜', basePrice: 5 }
    ];
    
    // Random selection of 3-5 items with price variations
    const availableItems = shopItems
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 3))
        .map(item => ({
            ...item,
            name: ipdk[item.emoji] ? (ipdk[item.emoji][window.currentLanguage] || ipdk[item.emoji].english) : '',
            price: Math.max(1, item.basePrice + Math.floor(Math.random() * 5) - 2)
        }));
    
    // Get player's inventory for selling
    const playerItems = window.inventory || [];
    
    storyDiv.innerHTML = `
        <div class="trading-interface">
            <h3>${translations['trader_shop'] || "TRADER'S SHOP"}</h3>
            <div class="gold-display">💰 ${translations['gold'] ? translations['gold'][0].toUpperCase() + translations['gold'].slice(1) : 'Gold'}: ${window.playerGold}</div>
            
            <div class="trade-section">
                <h4>${translations['buy_items'] || 'BUY ITEMS'}</h4>
                <div class="shop-items">
                    ${availableItems.map((item, index) => {
                        const canAfford = window.playerGold >= item.price;
                        const inventoryFull = window.inventory.length >= window.maxInventorySlots;
                        const canBuy = canAfford && !inventoryFull;
                        return `
                            <div class="shop-item ${!canBuy ? 'expensive' : ''}">
                                <div class="shop-item-emoji">${item.emoji}</div>
                                <div>${item.name}</div>
                                <div class="shop-item-price">${item.price} Gold</div>
                                <button class="combat-btn" onclick="buyItem('${item.emoji}', ${item.price})" ${!canBuy ? 'disabled' : ''} title="Buy">
                                    <span class="key-indicator">${index + 1}</span>
                                    ${translations['buy'] || 'BUY'} ${inventoryFull ? '(FULL)' : ''}
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            ${playerItems.length > 0 ? `
                <div class="trade-section">
                    <h4>${translations['sell_items'] || 'SELL ITEMS'}</h4>
                    <div class="sell-items">
                        ${playerItems.map((item, index) => {
                            const sellPrice = Math.max(1, Math.floor(Math.random() * 8) + 2); // 2-9 gold
                            const letter = String.fromCharCode(65 + index); // A, B, C, etc.
                            return `
                                <div class="shop-item sell-item">
                                    <div class="shop-item-emoji">${item}</div>
                                    <div class="shop-item-price">${sellPrice} Gold</div>
                                    <button class="combat-btn sell-btn" onclick="sellItem(${index}, ${sellPrice})" title="Sell">
                                        <span class="key-indicator">${letter}</span>
                                        ${translations['sell'] || 'SELL'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            
            <button class="combat-btn" onclick="leaveTrade()" title="Leave Shop">
                <span class="key-indicator">0</span>
                ${translations['leave_shop'] || 'LEAVE SHOP'}
            </button>
        </div>
    `;
    
    optionsDiv.innerHTML = '';
}

// Buy item from trader
function buyItem(emoji, price) {
    if (window.playerGold >= price) {
        // Check if inventory has space
        if (!animals || !animals[window.playerAnimal]) {
            showGameMessage(translations['animal_data_not_loaded'] || 'Animal data not loaded yet!');
            return;
        }
        
        const animalData = animals[window.playerAnimal];
        if (window.inventory.length >= animalData.stats.inventory) {
            showGameMessage(translations['inventory_full_buy'] || 'Inventory is full! Cannot buy more items.');
            return;
        }
        
        // Update local state
        window.playerGold -= price;
        window.inventory = window.inventory || [];
        window.inventory.push(emoji);
        
        console.log('Bought item:', emoji, 'New gold:', window.playerGold, 'New inventory:', window.inventory);
        
        // Update server and UI
        updateGoldAndInventoryInPlace();
    } else {
        const template = translations['need_gold'] || 'You need {price} gold but only have {gold} gold!';
        showGameMessage(template.replace('{price}', price).replace('{gold}', window.playerGold));
    }
}

// Sell item to trader
function sellItem(index, price) {
    if (window.inventory && window.inventory[index]) {
        console.log('Selling item at index:', index, 'for price:', price);
        
        // Update local state
        const soldItem = window.inventory[index];
        window.inventory.splice(index, 1);
        window.playerGold += price;
        
        console.log('Sold item:', soldItem, 'New gold:', window.playerGold, 'New inventory:', window.inventory);
        
        // Update server and UI
        updateGoldAndInventoryInPlace();
    } else {
        console.error('Item not found at index:', index, 'Inventory:', window.inventory);
    }
}

// Update gold and inventory via form submission
function updateGoldAndInventory() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    // Update both gold and inventory in one request
    const actionInput = document.createElement('input');
    actionInput.name = 'action';
    actionInput.value = 'update_gold';
    
    const goldInput = document.createElement('input');
    goldInput.name = 'gold';
    goldInput.value = window.playerGold;
    
    const inventoryInput = document.createElement('input');
    inventoryInput.name = 'inventory';
    inventoryInput.value = JSON.stringify(window.inventory);
    
    form.appendChild(actionInput);
    form.appendChild(goldInput);
    form.appendChild(inventoryInput);
    document.body.appendChild(form);
    
    form.submit();
}

// Update gold and inventory via AJAX to stay in trader view
function updateGoldAndInventoryInPlace() {
    // Update cookies directly via fetch
    const formData = new FormData();
    formData.append('action', 'update_gold');
    formData.append('gold', window.playerGold);
    formData.append('inventory', JSON.stringify(window.inventory));
    
    fetch('game.php', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            // Update the gold display in trader view
            const goldDisplay = document.querySelector('.gold-display');
            if (goldDisplay) {
                goldDisplay.innerHTML = `💰 Gold: ${window.playerGold}`;
            }
            
            // Refresh the trader view to show updated inventory and pricing
            setTimeout(() => {
                loadStoryContent('trader');
                // Also update the bottom inventory display
                setTimeout(() => updateInventoryDisplay(), 200);
            }, 100);
        }
    }).catch(error => {
        console.error('Error updating data:', error);
        // Fallback to page reload if AJAX fails
        location.reload();
    });
}

// Leave trading interface
function leaveTrade() {
    restorePreviousStory();
}

// Initialize tooltips for translation
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('translatable')) {
            const tooltip = event.target.querySelector('.translation-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
            }
        }
    });
    
    document.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('translatable')) {
            const tooltip = event.target.querySelector('.translation-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        }
    });
});

// Display puzzle interface
function displayPuzzle(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    storyDiv.innerHTML = `
        <div class="puzzle-interface">
            <h3>🧩 ${translations['puzzle_challenge'] || 'PUZZLE CHALLENGE'}</h3>
            <p>${storyData.text}</p>
            <div class="puzzle-input">
                <input type="text" id="puzzleAnswer" placeholder="${translations['enter_answer'] || 'Enter your answer...'}" class="answer-input">
                <div class="puzzle-buttons">
                    <button class="combat-btn" onclick="checkPuzzleAnswer('${storyData.answer}')" title="Submit">
                        <span class="key-indicator">1</span>
                        ${translations['submit'] || 'SUBMIT'}
                    </button>
                    <button class="combat-btn" onclick="showPuzzleHint('${storyData.hint}')" title="Hint">
                        <span class="key-indicator">2</span>
                        ${translations['hint'] || 'HINT'}
                    </button>
                    <button class="combat-btn" onclick="leavePuzzle()" title="Leave">
                        <span class="key-indicator">0</span>
                        ${translations['leave'] || 'LEAVE'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    optionsDiv.innerHTML = '';
    window.currentPuzzle = storyData;
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('puzzleAnswer').focus();
    }, 100);
}

// Check puzzle answer
function checkPuzzleAnswer(correctAnswer) {
    const userAnswer = document.getElementById('puzzleAnswer').value.toLowerCase().trim();
    const puzzle = window.currentPuzzle;
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        showGameMessage(puzzle.success);
        addRandomItem();
        setTimeout(() => loadStoryContent('intro'), 2000);
    } else {
        showGameMessage(puzzle.failure);
        document.getElementById('puzzleAnswer').value = '';
        document.getElementById('puzzleAnswer').focus();
    }
}

function showPuzzleHint(hint) {
    const label = translations['hint'] || 'Hint';
    showGameMessage(`${label}: ${hint}`);
}

function leavePuzzle() {
    window.currentPuzzle = null;
    restorePreviousStory();
}

// Display dialogue interface
function displayDialogue(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    storyDiv.innerHTML = `
        <div class="dialogue-interface">
            <div class="character-info">
                <span class="character-emoji">${storyData.character_emoji}</span>
                <h3>${storyData.character}</h3>
            </div>
            <p class="dialogue-text">${storyData.text}</p>
        </div>
    `;
    
    optionsDiv.innerHTML = storyData.responses.map((response, index) => `
        <div class="story-option" onclick="selectDialogueResponse(${index}, '${response.response.replace(/'/g, "\\'")}')">
            <span class="option-number">${index + 1}</span>
            <span class="option-text">${response.text}</span>
        </div>
    `).join('') + `
        <div class="story-option" onclick="leaveDialogue()">
            <span class="option-number">0</span>
            <span class="option-text" title="Leave conversation">${translations['leave_conversation'] || 'Leave conversation'}</span>
        </div>
    `;
}

function selectDialogueResponse(index, response) {
    showClosableMessage(response, () => {
        if (Math.random() > 0.5) {
            addRandomItem();
        } else {
            window.playerGold += Math.floor(Math.random() * 5) + 1;
            updateGoldAndInventory();
        }
        loadStoryContent('intro');
    });
}

function leaveDialogue() {
    restorePreviousStory();
}

// Display crafting interface
function displayCrafting(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    const playerInventory = window.inventory || [];
    
    storyDiv.innerHTML = `
        <div class="crafting-interface">
            <h3>🔨 ${translations['crafting_forge'] || 'CRAFTING FORGE'}</h3>
            <p>${storyData.text}</p>
            <div class="recipes">
                ${storyData.recipes.map((recipe, index) => {
                    const hasIngredients = recipe.ingredients.every(ingredient =>
                        playerInventory.includes(ingredient)
                    );
                    return `
                        <div class="recipe ${hasIngredients ? '' : 'missing-ingredients'}">
                            <div class="recipe-name">${recipe.name_local} (${recipe.name})</div>
                            <div class="recipe-ingredients">
                                ${translations['needs'] || 'Needs'}: ${recipe.ingredients.join(' + ')} → ${recipe.result}
                            </div>
                            <div class="recipe-description">${recipe.description}</div>
                            <button class="combat-btn" onclick="craftItem(${index})" ${hasIngredients ? '' : 'disabled'} title="Craft">
                                <span class="key-indicator">${index + 1}</span>
                                ${translations['craft'] || 'CRAFT'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="margin-top: 2rem;">
                <button class="combat-btn" onclick="leaveCrafting()" title="Leave Forge">
                    <span class="key-indicator">0</span>
                    ${translations['leave_forge'] || 'LEAVE FORGE'}
                </button>
            </div>
        </div>
    `;
    
    optionsDiv.innerHTML = '';
    window.currentCrafting = storyData;
}

function craftItem(recipeIndex) {
    const crafting = window.currentCrafting;
    const recipe = crafting.recipes[recipeIndex];
    
    // Check if we have all ingredients
    const hasIngredients = recipe.ingredients.every(ingredient => 
        window.inventory.includes(ingredient)
    );
    
    if (!hasIngredients) {
        showGameMessage(translations['missing_ingredients'] || "You don't have all the required ingredients!");
        return;
    }
    
    // Check if inventory has space for new item
    if (window.inventory.length >= window.maxInventorySlots) {
        showGameMessage(translations['inventory_full_craft'] || 'Inventory is full! Cannot craft more items.');
        return;
    }
    
    // Remove ingredients from inventory (one of each)
    recipe.ingredients.forEach(ingredient => {
        const index = window.inventory.indexOf(ingredient);
        if (index > -1) {
            window.inventory.splice(index, 1);
        }
    });
    
    // Add crafted item
    window.inventory.push(recipe.result);
    
    const craftedMsg = (translations['crafted_success'] || 'Successfully crafted {item}!').replace('{item}', recipe.name_local);
    showGameMessage(craftedMsg);
    updateGoldAndInventory();
    
    // Refresh crafting interface
    setTimeout(() => displayCrafting(crafting), 1000);
}

function leaveCrafting() {
    window.currentCrafting = null;
    restorePreviousStory();
}

// Display minigame interface
function displayMinigame(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');
    
    storyDiv.innerHTML = `
        <div class="minigame-interface">
            <h3>🎮 ${translations['memory_challenge'] || 'MEMORY CHALLENGE'}</h3>
            <p>${storyData.text}</p>
            <div id="memoryGame" class="memory-game">
                <!-- Game will be populated by JavaScript -->
            </div>
            <button class="combat-btn" onclick="leaveMinigame()">0. ${translations['leave'] || 'LEAVE'}</button>
        </div>
    `;
    
    optionsDiv.innerHTML = '';
    window.currentMinigame = storyData;
    initializeMemoryGame(storyData);
}

function initializeMemoryGame(storyData) {
    const gameDiv = document.getElementById('memoryGame');
    const pairs = storyData.pairs;
    let score = 0;
    let attempts = 0;
    let selectedLeft = null;
    let selectedRight = null;
    let matched = [];
    
    // Shuffle the right side words
    const shuffledEnglish = [...pairs.map(p => p.english)].sort(() => Math.random() - 0.5);
    
    const scoreTemplateInit = translations['score_attempts'] || 'Score: {score}/{total} | Attempts: {attempts}';
    gameDiv.innerHTML = `
        <div class="memory-score">${scoreTemplateInit.replace('{score}', score).replace('{total}', pairs.length).replace('{attempts}', attempts)}</div>
        <div class="memory-matching-game">
            <div class="memory-left-column">
                <h4>${translations['match_words'] || 'Match these words:'}</h4>
                ${pairs.map((pair, index) => {
                    const local = storyData.pairs[index][window.currentLanguage === 'french' ? 'french' : 'spanish'];
                    return `
                        <div class="memory-word-left" data-index="${index}" onclick="selectLeftWord(${index})">
                            <span class="key-indicator">${index + 1}</span>
                            ${local}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="memory-right-column">
                <h4>${translations['to_meanings'] || 'To their meanings:'}</h4>
                ${shuffledEnglish.map((english, index) => {
                    const letter = String.fromCharCode(65 + index); // A, B, C, etc.
                    return `
                        <div class="memory-word-right" data-english="${english}" onclick="selectRightWord('${english}')">
                            <span class="key-indicator">${letter}</span>
                            ${english}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    window.memoryGameState = { 
        score, 
        attempts, 
        pairs, 
        selectedLeft, 
        selectedRight, 
        matched: [],
        storyData 
    };
}

function selectLeftWord(index) {
    // Clear previous selections
    document.querySelectorAll('.memory-word-left').forEach(el => el.classList.remove('selected'));
    
    // Select this word
    const wordElement = document.querySelector(`[data-index="${index}"]`);
    wordElement.classList.add('selected');
    
    window.memoryGameState.selectedLeft = index;
    
    // If right word is already selected, check match
    if (window.memoryGameState.selectedRight !== null) {
        checkMemoryMatch();
    }
}

function selectRightWord(english) {
    // Clear previous selections
    document.querySelectorAll('.memory-word-right').forEach(el => el.classList.remove('selected'));
    
    // Select this word
    const wordElement = document.querySelector(`[data-english="${english}"]`);
    wordElement.classList.add('selected');
    
    window.memoryGameState.selectedRight = english;
    
    // If left word is already selected, check match
    if (window.memoryGameState.selectedLeft !== null) {
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const state = window.memoryGameState;
    const leftIndex = state.selectedLeft;
    const rightWord = state.selectedRight;
    const correctAnswer = state.pairs[leftIndex].english;
    
    state.attempts++;
    
    const leftElement = document.querySelector(`[data-index="${leftIndex}"]`);
    const rightElement = document.querySelector(`[data-english="${rightWord}"]`);
    
    if (rightWord === correctAnswer) {
        // Correct match!
        state.score++;
        state.matched.push(leftIndex);
        
        // Grey out matched words
        leftElement.classList.add('matched');
        rightElement.classList.add('matched');
        leftElement.onclick = null;
        rightElement.onclick = null;
        
        showGameMessage(translations['correct_match'] || 'Correct match!');
        
        // Check if game is complete
        if (state.score >= state.pairs.length) {
            setTimeout(() => {
                showGameMessage(window.currentMinigame.success);
                addRandomItem();
                setTimeout(() => loadStoryContent('intro'), 2000);
            }, 1000);
        }
    } else {
        // Wrong match
        showGameMessage(translations['try_again'] || 'Try again!');
        
        // Flash red briefly
        leftElement.style.background = 'rgba(255, 0, 0, 0.3)';
        rightElement.style.background = 'rgba(255, 0, 0, 0.3)';
        
        setTimeout(() => {
            leftElement.style.background = '';
            rightElement.style.background = '';
        }, 500);
    }
    
    // Clear selections
    leftElement.classList.remove('selected');
    rightElement.classList.remove('selected');
    state.selectedLeft = null;
    state.selectedRight = null;
    
    // Update score display
    const gameDiv = document.getElementById('memoryGame');
    const scoreTemplate = translations['score_attempts'] || 'Score: {score}/{total} | Attempts: {attempts}';
    gameDiv.querySelector('.memory-score').textContent =
        scoreTemplate.replace('{score}', state.score).replace('{total}', state.pairs.length).replace('{attempts}', state.attempts);
}

function leaveMinigame() {
    window.currentMinigame = null;
    window.memoryGameState = null;
    restorePreviousStory();
}

// ----- Word Quiz Challenge -----
function displayWordQuiz(storyData) {
    const storyDiv = document.getElementById('storyText');
    const optionsDiv = document.getElementById('gameOptions');

    storyDiv.innerHTML = `
        <div class="word-quiz-interface">
            <div class="quiz-progress"><div class="quiz-progress-fill" style="width:0%"></div></div>
            <h3>📝 ${translations['word_challenge'] || 'WORD CHALLENGE'}</h3>
            <div id="quizWord" class="quiz-word"></div>
            <div id="quizOptions" class="quiz-options"></div>
            <button class="combat-btn" onclick="leaveWordQuiz()">0. ${translations['leave'] || 'LEAVE'}</button>
        </div>
    `;

    optionsDiv.innerHTML = '';

    window.currentWordQuiz = {
        pairs: storyData.pairs,
        index: 0,
        success: storyData.success || (translations['great_job'] || 'Great job!')
    };

    showNextQuizWord();
}

function showNextQuizWord() {
    const state = window.currentWordQuiz;
    if (!state) return;

    if (state.index >= state.pairs.length) {
        showGameMessage(state.success);
        addRandomItem();
        setTimeout(() => loadStoryContent('intro'), 2000);
        window.currentWordQuiz = null;
        return;
    }

    const pair = state.pairs[state.index];
    const localWord = pair[window.currentLanguage === 'french' ? 'french' : 'spanish'];
    const correct = pair.english;

    const allEnglish = state.pairs.map(p => p.english);
    const options = shuffleArray(
        [correct, ...shuffleArray(allEnglish.filter(w => w !== correct)).slice(0, 5)]
    );

    document.getElementById('quizWord').textContent = localWord;
    document.getElementById('quizOptions').innerHTML = options.map((opt, idx) => `
        <div class="quiz-option" data-word="${opt}" onclick="selectQuizOption('${opt}')">
            <span class="key-indicator">${idx + 1}</span>
            ${opt}
        </div>
    `).join('');

    const progress = (state.index / state.pairs.length) * 100;
    document.querySelector('.quiz-progress-fill').style.width = `${progress}%`;
}

function selectQuizOption(word) {
    const state = window.currentWordQuiz;
    if (!state) return;

    const pair = state.pairs[state.index];
    if (word === pair.english) {
        showGameMessage(translations['correct_answer'] || 'Correct!');
        state.index++;
        setTimeout(showNextQuizWord, 800);
    } else {
        showGameMessage(translations['try_again'] || 'Try again!');
    }
}

function leaveWordQuiz() {
    window.currentWordQuiz = null;
    restorePreviousStory();
}

function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

// Expose certain functions for non-module scripts (e.g., index.php)
window.loadTranslations = loadTranslations;
window.loadAnimals = loadAnimals;
