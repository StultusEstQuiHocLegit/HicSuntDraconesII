// Placeholder for OpenAI API key
const OPENAI_API_KEY = 'PLACEHOLDER';

// Hardcoded JSON examples (replace with your actual JSON content)
const chapter1 = {
    "spanish": {
        "text": "Después de careful consideration, decides tomar el path hacia el dark forest. Los ancient árboles se alzan como powerful guardians, y el mysterious sonido del wind through las leaves te llena de both excitement y apprehension. Tu brave companion está alert, sensing el danger que might lurk en las shadows. De repente, ves una strange light brillando entre los trees. ¿Could it be magic? ¿Or perhaps otro traveler lost en este vast wilderness?",
        "options": [
            "Investigar la strange light",
            "Evitar la light y continuar por el main path",
            "Enviar a tu companion a investigate primero",
            "Descansar y wait hasta que la light desaparezca",
            "Llamar a quien might estar cerca de la light"
        ]
    },
    "french": {
        "text": "Après careful consideration, vous décidez de prendre le path vers la dark forêt. Les ancient arbres se dressent comme powerful guardiens, et le mysterious son du wind à travers les leaves vous remplit de both excitement et apprehension. Votre brave companion est alert, sentant le danger qui might se cacher dans les shadows. Soudain, vous voyez une strange light brillant entre les trees. Could it be magic? Ou perhaps un autre traveler perdu dans cette vast wilderness?",
        "options": [
            "Investiguer la strange light",
            "Éviter la light et continuer sur le main path",
            "Envoyer votre companion pour investigate en premier",
            "Se reposer et wait jusqu'à ce que la light disparaisse",
            "Appeler celui qui might être près de la light"
        ]
    }
};

const combat = {
    "spanish": {
        "type": "combat",
        "enemy": "wolf",
        "text": "¡Un wild wolf appears! The dangerous beast blocks your path con aggressive growling. Tu companion está ready para fight, pero this battle será challenging. Prepare para combat!"
    },
    "french": {
        "type": "combat", 
        "enemy": "wolf",
        "text": "Un wild wolf apparaît! La dangerous bête bloque votre path avec aggressive growling. Votre companion est ready pour fight, mais cette battle sera challenging. Préparez-vous pour combat!"
    }
};

const crafting = {
    "spanish": {
        "type": "crafting",
        "text": "You discover an ancient forge still glowing con magical fire. The spirit del blacksmith appears: 'Welcome, traveler! I can help you crear powerful items if you have the right materials. What would you like to craft?'",
        "recipes": [
            {
                "name": "Healing Potion",
                "name_local": "Poción Curativa", 
                "ingredients": ["🌿", "💧"],
                "result": "🧪",
                "description": "Restores health durante battle"
            },
            {
                "name": "Magic Sword",
                "name_local": "Espada Mágica",
                "ingredients": ["⚔️", "🌟"],
                "result": "🗡️",
                "description": "Increases attack power significantly"
            },
            {
                "name": "Protection Amulet", 
                "name_local": "Amuleto Protector",
                "ingredients": ["🧿", "💎"],
                "result": "🛡️",
                "description": "Reduces incoming damage"
            }
        ]
    },
    "french": {
        "type": "crafting",
        "text": "Vous découvrez une ancient forge encore glowing avec magical fire. L'esprit du blacksmith appears: 'Bienvenue, traveler! Je peux vous aider à créer powerful items si vous avez les right matériaux. Que voulez-vous craft?'",
        "recipes": [
            {
                "name": "Healing Potion",
                "name_local": "Potion Curative",
                "ingredients": ["🌿", "💧"], 
                "result": "🧪",
                "description": "Restore la santé pendant battle"
            },
            {
                "name": "Magic Sword",
                "name_local": "Épée Magique",
                "ingredients": ["⚔️", "🌟"],
                "result": "🗡️", 
                "description": "Augmente attack power significativement"
            },
            {
                "name": "Protection Amulet",
                "name_local": "Amulette Protectrice",
                "ingredients": ["🧿", "💎"],
                "result": "🛡️",
                "description": "Réduit incoming damage"
            }
        ]
    }
};

const dialogue = {
    "spanish": {
        "type": "dialogue",
        "character": "Wise Elder",
        "character_emoji": "🧙‍♂️",
        "text": "Greetings, young adventurer! I am el ancient Elder of this village. Many travelers pasan por aquí, but few have the courage to face what lies ahead. Tell me, ¿por qué do you journey through these dangerous lands?",
        "responses": [
            {
                "text": "Busco treasure y glory",
                "response": "Ah, la greed drives many. But remember, true treasure is not always gold, pequeño one."
            },
            {
                "text": "I want to help people en need",
                "response": "Noble words! The world needs más heroes like you. Take this blessing para your journey."
            },
            {
                "text": "I'm lost y need directions",
                "response": "Honesty is refreshing! The path forward es dangerous, but I will give you a map."
            }
        ]
    },
    "french": {
        "type": "dialogue",
        "character": "Wise Elder",
        "character_emoji": "🧙‍♂️", 
        "text": "Salutations, jeune adventurer! Je suis l'ancient Elder de ce village. Many travelers passent par ici, mais few ont le courage de face what lies ahead. Dites-moi, pourquoi do you journey à travers ces dangerous lands?",
        "responses": [
            {
                "text": "Je cherche treasure et glory", 
                "response": "Ah, la greed pousse beaucoup. Mais remember, true treasure n'est pas toujours gold, petit one."
            },
            {
                "text": "I want aider les gens en need",
                "response": "Noble words! Le monde a besoin de plus heroes comme vous. Prenez cette blessing pour votre journey."
            },
            {
                "text": "Je suis lost et need directions",
                "response": "Honesty est refreshing! Le path en avant est dangerous, mais I will give you une map."
            }
        ]
    }
};

const intro = {
    "spanish": {
        "text": "Bienvenido al mundo de Hic Sunt Dracones. En este ancient reino, donde dragon y knight se encuentran en battle, tu adventure comienza en un small village cerca del dark forest. El wise anciano del village te ha encomendado una important quest: encontrar el legendary treasure escondido en la mysterious mountain. Pero cuidado, porque el path está lleno de danger y solo los brave pueden completar este perilous journey. Tu magic companion te ayudará, pero la choice final siempre será tuya.",
        "options": [
            "Explorar el dark forest",
            "Dirigirse directamente a la mountain",
            "Buscar más información en el village",
            "Preparar equipment para el journey",
            "Enter combat training",
            "Visit the traveling trader",
            "Try the memory training challenge",
            "Attempt the word quiz challenge"
        ]
    },
    "french": {
        "text": "Bienvenue dans le monde de Hic Sunt Dracones. Dans ce ancient royaume, où dragon et knight se rencontrent en battle, votre adventure commence dans un small village près de la dark forêt. Le wise ancien du village vous a confié une important quest: trouver le legendary treasure caché dans la mysterious mountain. Mais attention, car le path est plein de danger et seuls les brave peuvent compléter ce perilous journey. Votre magic companion vous aidera, mais le choice final sera toujours vôtre.",
        "options": [
            "Explorer la dark forêt",
            "Se diriger directement vers la mountain",
            "Chercher plus d'informations dans le village",
            "Préparer l'equipment pour le journey",
            "Enter combat training",
            "Visit the traveling trader",
            "Try the memory training challenge",
            "Attempt the word quiz challenge"
        ]
    }
};

const minigame = {
    "spanish": {
        "type": "minigame",
        "game_type": "memory",
        "text": "You enter una mysterious library where books float en el air. The librarian ghost challenges you: 'Match the Spanish words with their English meanings para unlock the secret knowledge!'",
        "pairs": [
            {"spanish": "casa", "english": "house"},
            {"spanish": "agua", "english": "water"}, 
            {"spanish": "fuego", "english": "fire"},
            {"spanish": "tiempo", "english": "time"},
            {"spanish": "corazón", "english": "heart"},
            {"spanish": "aventura", "english": "adventure"}
        ],
        "success": "¡Excelente! The ghost is impressed. 'Take this ancient tome para your studies!'",
        "failure": "The ghost sighs. 'Study more, young scholar. Come back cuando you're ready.'"
    },
    "french": {
        "type": "minigame",
        "game_type": "memory",
        "text": "Vous entrez dans une mysterious bibliothèque où books float dans l'air. Le librarian ghost vous challenge: 'Match les French words avec leurs English meanings pour unlock le secret knowledge!'",
        "pairs": [
            {"french": "maison", "english": "house"},
            {"french": "eau", "english": "water"},
            {"french": "feu", "english": "fire"}, 
            {"french": "temps", "english": "time"},
            {"french": "cœur", "english": "heart"},
            {"french": "aventure", "english": "adventure"}
        ],
        "success": "Excellent! Le ghost est impressed. 'Prenez ce ancient tome pour vos études!'",
        "failure": "Le ghost soupire. 'Étudiez plus, young scholar. Revenez quand vous êtes ready.'"
    }
};

const mountain = {
    "spanish": {
        "text": "Te diriges hacia la mysterious mountain, evitando el dark forest. El rocky path es difficult, pero tu determined spirit te mantiene moving forward. Después de hours of climbing, llegas a una ancient cave entrance. Strange symbols están carved en la stone, y una gentle breeze viene desde inside. Tu companion seems nervous pero ready para la adventure. En la distance, puedes hear el sound de running water y perhaps... voices?",
        "options": [
            "Entrar en la cave inmediatamente",
            "Estudiar los strange symbols primero",
            "Buscar otro entrance around la mountain",
            "Rest y prepare antes de entering",
            "Call out para see si someone responds"
        ]
    },
    "french": {
        "text": "Vous vous dirigez vers la mysterious mountain, évitant la dark forêt. Le rocky path est difficult, mais votre determined spirit vous maintient moving forward. Après hours de climbing, vous arrivez à une ancient cave entrance. Strange symbols sont carved dans la stone, et une gentle breeze vient depuis inside. Votre companion semble nervous mais ready pour la adventure. Dans la distance, vous pouvez hear le sound de running water et perhaps... voices?",
        "options": [
            "Entrer dans la cave immédiatement",
            "Étudier les strange symbols d'abord",
            "Chercher un autre entrance autour de la mountain",
            "Rest et prepare avant de entering",
            "Call out pour voir si someone responds"
        ]
    }
};

const puzzle = {
    "spanish": {
        "type": "puzzle",
        "puzzle_type": "riddle",
        "text": "An ancient guardian blocks your path. The stone golem speaks in riddles: 'Tengo llaves pero no locks, space pero no room, you can enter pero no go outside. ¿Qué soy?' You must answer correctly to pass.",
        "answer": "keyboard",
        "hint": "Think about something you use para escribir...",
        "success": "¡Correcto! The golem steps aside, impressed by tu wisdom. You may pass safely.",
        "failure": "The golem shakes su head. 'Try again, pequeño adventurer.'"
    },
    "french": {
        "type": "puzzle",
        "puzzle_type": "riddle", 
        "text": "Un ancient guardian bloque votre path. Le stone golem parle en riddles: 'J'ai des clés mais pas de locks, space mais pas de room, you can enter mais pas go outside. Qu'est-ce que je suis?' Vous devez answer correctly pour passer.",
        "answer": "keyboard",
        "hint": "Pensez à quelque chose que vous utilisez pour écrire...",
        "success": "Correct! Le golem s'écarte, impressionné par votre wisdom. Vous pouvez passer safely.",
        "failure": "Le golem secoue sa tête. 'Essayez encore, petit adventurer.'"
    }
};

const trader = {
    "spanish": {
        "type": "trading",
        "text": "Encuentras a un mysterious trader en el path. El wise merchant tiene many precious items para sell. Sus eyes sparkle con greed mientras examina tu gold. '¡Welcome, brave adventurer!' dice con una sly smile. 'I have exactly lo que you need para tu dangerous journey ahead.'"
    },
    "french": {
        "type": "trading",
        "text": "Vous trouvez un mysterious trader sur le path. Le wise merchant a many precious items pour sell. Ses eyes sparkle avec greed pendant qu'il examine votre gold. '¡Welcome, brave aventurier!' dit-il avec une sly smile. 'J'ai exactement ce que vous need pour votre dangerous journey ahead.'"
    }
};

const treasure = {
    "spanish": {
        "text": "¡Felicidades, brave adventurer! Después de un long y dangerous journey, finalmente has encontrado el legendary treasure de Hic Sunt Dracones. El ancient chest se abre con un brilliant light, revelando no solo gold y precious gems, sino también ancient scrolls que contienen powerful knowledge. Tu wise companion está proud de tu achievement. Has demostrado que tienes el courage y wisdom para ser un true hero. El village celebrará tu victory, y tu name será recordado en legends por generations.",
        "options": [
            "Regresar al village como un hero",
            "Explorar más mysteries de este realm",
            "Compartir el treasure con tu companion",
            "Continuar la adventure en nuevas lands"
        ]
    },
    "french": {
        "text": "Félicitations, brave aventurier! Après un long et dangerous journey, vous avez finalement trouvé le legendary treasure de Hic Sunt Dracones. Le ancient coffre s'ouvre avec une brilliant light, révélant non seulement gold et precious gems, mais aussi ancient scrolls qui contiennent powerful knowledge. Votre wise companion est proud de votre achievement. Vous avez démontré que vous avez le courage et wisdom pour être un true hero. Le village célébrera votre victory, et votre name sera rappelé dans legends pour generations.",
        "options": [
            "Retourner au village comme un hero",
            "Explorer plus de mysteries de ce realm",
            "Partager le treasure avec votre companion",
            "Continuer la adventure dans nouvelles lands"
        ]
    }
};

const village = {
    "spanish": {
        "text": "Decides permanecer en el village para gather more information. Los friendly villagers te cuentan ancient legends sobre el treasure. Una old woman te da una mysterious amulet que she claims will protect you durante tu dangerous journey. El village blacksmith offers to strengthen tu equipment, mientras que el wise priest shares valuable knowledge sobre las creatures que live en la mountain y forest. Tu companion enjoys el attention y rest.",
        "options": [
            "Accept el amulet de la old woman",
            "Visit el blacksmith para equipment upgrades",
            "Listen más stories del wise priest",
            "Explore otras parts del village",
            "Visit the wise elder for advice",
            "Seek the ancient library puzzle",
            "Leave el village ahora con nueva información"
        ]
    },
    "french": {
        "text": "Vous décidez de rester dans le village pour gather plus d'informations. Les friendly villagers vous racontent ancient legends sur le treasure. Une old woman vous donne une mysterious amulet qu'elle claims vous protégera durant votre dangerous journey. Le village blacksmith offers de strengthener votre equipment, tandis que le wise priest partage valuable knowledge sur les creatures qui live dans la mountain et forêt. Votre companion profite de l'attention et rest.",
        "options": [
            "Accept l'amulet de la old woman",
            "Visit le blacksmith pour equipment upgrades",
            "Listen plus de stories du wise priest",
            "Explorer d'autres parts du village",
            "Visit the wise elder for advice",
            "Seek the ancient library puzzle",
            "Leave le village maintenant avec nouvelle information"
        ]
    }
};

const wordquiz = {
    "spanish": {
        "type": "wordquiz",
        "text": "Un sabio mago te reta: 'Elige la traducción correcta de cada palabra.'",
        "pairs": [
            {"spanish": "gato", "english": "cat"},
            {"spanish": "perro", "english": "dog"},
            {"spanish": "rojo", "english": "red"},
            {"spanish": "azul", "english": "blue"},
            {"spanish": "libro", "english": "book"},
            {"spanish": "ciudad", "english": "city"},
            {"spanish": "árbol", "english": "tree"},
            {"spanish": "día", "english": "day"},
            {"spanish": "noche", "english": "night"},
            {"spanish": "amigo", "english": "friend"},
            {"spanish": "comida", "english": "food"},
            {"spanish": "sueño", "english": "dream"}
        ],
        "success": "¡Excelente! Has dominado estas palabras."
    },
    "french": {
        "type": "wordquiz",
        "text": "Un mage sage vous met au défi : 'Choisissez la bonne traduction de chaque mot.'",
        "pairs": [
            {"french": "chat", "english": "cat"},
            {"french": "chien", "english": "dog"},
            {"french": "rouge", "english": "red"},
            {"french": "bleu", "english": "blue"},
            {"french": "livre", "english": "book"},
            {"french": "ville", "english": "city"},
            {"french": "arbre", "english": "tree"},
            {"french": "jour", "english": "day"},
            {"french": "nuit", "english": "night"},
            {"french": "ami", "english": "friend"},
            {"french": "nourriture", "english": "food"},
            {"french": "rêve", "english": "dream"}
        ],
        "success": "Excellent ! Vous maîtrisez ces mots."
    }
};




















// Return as array of strings or objects as needed
async function loadTemplates() {
  return [
    chapter1,
    combat,
    crafting,
    // dialogue,
    // wordquiz,
    // intro,
    // village,
    // mountain,
    // puzzle,
    // trader,
    // treasure,
    minigame
  ];
}

// Get last 20 AI-generated texts from localStorage
function getStoryContext() {
  const context = JSON.parse(localStorage.getItem('storyContext')) || [];
  return context.slice(-20);
}

function getContextTexts() {
  return getStoryContext().map(entry =>
    typeof entry === 'string' ? entry : entry.text
  );
}

// Save new AI-generated text to localStorage
function saveToContext(chapter, newText) {
  const context = getStoryContext();
  context.push({ chapter, text: newText });
  localStorage.setItem('storyContext', JSON.stringify(context.slice(-20)));
  localStorage.setItem('currentChapter', chapter);
}

// Generate story using a hardcoded example (for testing)
// async function generateStory(userInput) {
//   // For testing, just return the combat example
//   saveToContext(JSON.stringify(combat));
//   return combat; // Return the full JSON object, not just text
// }

// Generate story using AI
async function generateStory(userInput) {
  const templates = await loadTemplates();
  const context = getContextTexts();

  // Build the prompt for AI
  const prompt = `
You are a story generator. Use the following examples as templates for your output format:
${templates.map((t, i) => `Example ${i + 1}:\n${JSON.stringify(t, null, 2)}`).join('\n\n')}
Continue the story, keeping the style and format above. Here is the recent story context:
${context.join('\n')}
User input: ${userInput}
Please make sure to answer exactly in the same format as the examples provided, in the exact same JSON format, and ensure that the story continues logically from the last context.
  `;

  // Log the prompt sent to the AI
  console.log("Prompt sent to AI:", prompt);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o', // or your preferred model
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  let aiText = data.choices[0].message.content.trim();

  if (aiText.startsWith("```")) {
    aiText = aiText.replace(/^```(?:json)?\s*|\s*```$/g, '');
  }

  // Log the raw AI response for debugging
  console.log("Raw AI response:", aiText);
  
  // Try to parse the AI's response as JSON
  let storyData;
  try {
    storyData = JSON.parse(aiText);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", aiText, e);
    storyData = { text: aiText }; // fallback object
  }

  saveToContext(userInput, aiText);
  return storyData;
}

export { generateStory };
