// Placeholder for OpenAI API key
const OPENAI_API_KEY = 'PLACEHOLDER';

// Hardcoded JSON examples (replace with your actual JSON content)
const chapter1 = {
    "spanish": {
        "text": "Después de considerar cuidadosamente, decides tomar el camino hacia el bosque oscuro. Los antiguos árboles se alzan como guardianes poderosos y el misterioso sonido del viento entre las hojas te llena de emoción y temor. Tu valiente compañero está alerta, intuyendo el peligro que puede acechar entre las sombras. De repente, ves una luz extraña brillando entre los árboles. ¿Podría ser magia? ¿O tal vez otro viajero perdido en esta vasta naturaleza?",
        "options": [
            "Investigar la luz extraña (posible combate)",
            "Evitar la luz y continuar por el camino principal",
            "Consultar a tu compañero sobre la luz",
            "Reunir materiales cercanos para forjar",
            "Buscar un comerciante cercano"
        ]
    },
    "french": {
        "text": "Après mûre réflexion, vous décidez de prendre le chemin vers la forêt sombre. Les arbres anciens se dressent comme de puissants gardiens et le son mystérieux du vent dans les feuilles vous remplit d'excitation et d'appréhension. Votre compagnon courageux est alerte, sentant le danger qui pourrait se cacher dans l'ombre. Soudain, vous apercevez une lumière étrange entre les arbres. Serait-ce de la magie ? Ou peut-être un autre voyageur perdu dans cette vaste nature ?",
        "options": [
            "Investiguer la lumière étrange (peut-être un combat)",
            "Éviter la lumière et continuer sur le chemin principal",
            "Consulter votre compagnon au sujet de la lumière",
            "Rassembler des matériaux proches pour forger",
            "Chercher un marchand proche"
        ]
    }
};

const combat = {
    "spanish": {
        "type": "combat",
        "enemy": "wolf",
        "text": "¡Un lobo salvaje aparece! La peligrosa bestia bloquea tu camino con gruñidos agresivos. Tu compañero está listo para luchar, pero esta batalla será difícil. ¡Prepárate para combatir!"
    },
    "french": {
        "type": "combat", 
        "enemy": "wolf",
        "text": "Un loup sauvage apparaît ! La bête dangereuse bloque votre chemin avec des grognements agressifs. Votre compagnon est prêt à se battre, mais ce combat sera difficile. Préparez-vous à combattre !"
    }
};

const crafting = {
    "spanish": {
        "type": "crafting",
        "text": "Descubres una antigua forja que aún resplandece con fuego mágico. El espíritu del herrero aparece: '¡Bienvenido, viajero! Puedo ayudarte a crear objetos poderosos si tienes los materiales adecuados. ¿Qué te gustaría forjar?'",
        "recipes": [
            {
                "name": "Healing Potion",
                "name_local": "Poción Curativa", 
                "ingredients": ["🌿", "💧"],
                "result": "🧪",
                "description": "Restaura salud durante la batalla"
            },
            {
                "name": "Magic Sword",
                "name_local": "Espada Mágica",
                "ingredients": ["⚔️", "🌟"],
                "result": "🗡️",
                "description": "Aumenta considerablemente el poder de ataque"
            },
            {
                "name": "Protection Amulet", 
                "name_local": "Amuleto Protector",
                "ingredients": ["🧿", "💎"],
                "result": "🛡️",
                "description": "Reduce el daño recibido"
            }
        ]
    },
    "french": {
        "type": "crafting",
        "text": "Vous découvrez une ancienne forge encore ardente de feu magique. L'esprit du forgeron apparaît : 'Bienvenue, voyageur ! Je peux vous aider à créer des objets puissants si vous avez les matériaux adéquats. Que souhaitez-vous forger ?'",
        "recipes": [
            {
                "name": "Healing Potion",
                "name_local": "Potion Curative",
                "ingredients": ["🌿", "💧"], 
                "result": "🧪",
                "description": "Restaure la santé pendant la bataille"
            },
            {
                "name": "Magic Sword",
                "name_local": "Épée Magique",
                "ingredients": ["⚔️", "🌟"],
                "result": "🗡️", 
                "description": "Augmente considérablement la puissance d'attaque"
            },
            {
                "name": "Protection Amulet",
                "name_local": "Amulette Protectrice",
                "ingredients": ["🧿", "💎"],
                "result": "🛡️",
                "description": "Réduit les dégâts reçus"
            }
        ]
    }
};

const dialogue = {
    "spanish": {
        "type": "dialogue",
        "character": "Wise Elder",
        "character_emoji": "🧙‍♂️",
        "text": "¡Saludos, joven aventurero! Soy el anciano del pueblo. Muchos viajeros pasan por aquí, pero pocos tienen el valor de enfrentar lo que se encuentra más adelante. Dime, ¿por qué viajas por estas tierras peligrosas?",
        "responses": [
            {
                "text": "Busco tesoros y gloria",
                "response": "Ah, la codicia guía a muchos. Pero recuerda, el verdadero tesoro no siempre es oro, pequeño."
            },
            {
                "text": "Quiero ayudar a la gente necesitada",
                "response": "¡Palabras nobles! El mundo necesita más héroes como tú. Toma esta bendición para tu viaje."
            },
            {
                "text": "Estoy perdido y necesito direcciones",
                "response": "¡Tu honestidad es refrescante! El camino adelante es peligroso, pero te daré un mapa."
            }
        ]
    },
    "french": {
        "type": "dialogue",
        "character": "Wise Elder",
        "character_emoji": "🧙‍♂️", 
        "text": "Salutations, jeune aventurier ! Je suis l'ancien sage de ce village. De nombreux voyageurs passent par ici, mais peu ont le courage d'affronter ce qui vous attend. Dites-moi, pourquoi parcourez-vous ces terres dangereuses ?",
        "responses": [
            {
                "text": "Je cherche trésor et gloire",
                "response": "Ah, la cupidité pousse beaucoup de gens. Mais souvenez-vous, le véritable trésor n'est pas toujours de l'or, petit."
            },
            {
                "text": "Je veux aider les gens dans le besoin",
                "response": "Paroles nobles ! Le monde a besoin de plus de héros comme vous. Prenez cette bénédiction pour votre voyage."
            },
            {
                "text": "Je suis perdu et j'ai besoin de directions",
                "response": "Votre honnêteté est rafraîchissante ! Le chemin devant est dangereux, mais je vous donnerai une carte."
            }
        ]
    }
};

const intro = {
    "spanish": {
        "text": "Bienvenido al mundo de Hic Sunt Dracones. En este antiguo reino, donde dragones y caballeros se enfrentan en batalla, tu aventura comienza en una pequeña aldea cerca del bosque oscuro. El sabio anciano del pueblo te ha encomendado una misión importante: encontrar el tesoro legendario escondido en la montaña misteriosa. Pero cuidado, el camino está lleno de peligros y solo los valientes podrán completar esta peligrosa travesía. Tu compañero mágico te ayudará, pero la decisión final siempre será tuya.",
        "options": [
            "Explorar el bosque oscuro",
            "Dirigirse directamente a la montaña",
            "Buscar más información en la aldea",
            "Preparar el equipo para el viaje",
            "Entrenar para el combate",
            "Visitar al comerciante ambulante",
            "Probar el desafío de memoria",
            "Intentar el desafío de palabras"
        ]
    },
    "french": {
        "text": "Bienvenue dans le monde de Hic Sunt Dracones. Dans ce royaume ancien, où dragons et chevaliers s'affrontent en bataille, votre aventure commence dans un petit village près de la forêt sombre. Le sage du village vous a confié une quête importante : trouver le trésor légendaire caché dans la montagne mystérieuse. Mais attention, le chemin est plein de dangers et seuls les courageux pourront accomplir ce périlleux voyage. Votre compagnon magique vous aidera, mais le choix final sera toujours le vôtre.",
        "options": [
            "Explorer la forêt sombre",
            "Se diriger directement vers la montagne",
            "Chercher plus d'informations dans le village",
            "Préparer l'équipement pour le voyage",
            "S'entraîner au combat",
            "Visiter le marchand ambulant",
            "Tenter le défi de mémoire",
            "Essayer le quiz de mots"
        ]
    }
};

const minigame = {
    "spanish": {
        "type": "minigame",
        "game_type": "memory",
        "text": "Entras en una biblioteca misteriosa donde los libros flotan en el aire. El fantasma bibliotecario te desafía: 'Empareja las palabras en español con sus significados en inglés para desbloquear el conocimiento secreto.'",
        "pairs": [
            {"spanish": "casa", "english": "house"},
            {"spanish": "agua", "english": "water"}, 
            {"spanish": "fuego", "english": "fire"},
            {"spanish": "tiempo", "english": "time"},
            {"spanish": "corazón", "english": "heart"},
            {"spanish": "aventura", "english": "adventure"}
        ],
        "success": "¡Excelente! El fantasma está impresionado. '¡Lleva este antiguo tomo para tus estudios!'",
        "failure": "El fantasma suspira. 'Estudia más, joven erudito. Vuelve cuando estés listo.'"
    },
    "french": {
        "type": "minigame",
        "game_type": "memory",
        "text": "Vous entrez dans une bibliothèque mystérieuse où les livres flottent dans l'air. Le fantôme bibliothécaire vous lance un défi : 'Associez les mots français à leur signification en anglais pour déverrouiller le savoir secret.'",
        "pairs": [
            {"french": "maison", "english": "house"},
            {"french": "eau", "english": "water"},
            {"french": "feu", "english": "fire"}, 
            {"french": "temps", "english": "time"},
            {"french": "cœur", "english": "heart"},
            {"french": "aventure", "english": "adventure"}
        ],
        "success": "Excellent ! Le fantôme est impressionné. 'Prenez ce vieux grimoire pour vos études !'",
        "failure": "Le fantôme soupire. 'Étudiez davantage, jeune érudit. Revenez quand vous serez prêt.'"
    }
};

const mountain = {
    "spanish": {
        "text": "Te diriges hacia la montaña misteriosa, evitando el bosque oscuro. El sendero rocoso es difícil, pero tu espíritu decidido te mantiene avanzando. Después de horas de escalada, llegas a la entrada de una cueva antigua. Símbolos extraños están tallados en la piedra y una suave brisa sale del interior. Tu compañero parece nervioso pero listo para la aventura. A lo lejos puedes oír el sonido del agua corriendo y quizá... voces?",
        "options": [
            "Entrar en la cueva inmediatamente (posible combate)",
            "Estudiar los símbolos extraños, quizás sea un acertijo",
            "Buscar otra entrada alrededor de la montaña",
            "Descansar y prepararse antes de entrar",
            "Gritar para ver si alguien responde"
        ]
    },
    "french": {
        "text": "Vous vous dirigez vers la montagne mystérieuse, évitant la forêt sombre. Le chemin rocailleux est difficile, mais votre esprit déterminé vous pousse à avancer. Après des heures d'escalade, vous arrivez à l'entrée d'une vieille grotte. Des symboles étranges sont gravés dans la pierre et une douce brise en sort. Votre compagnon semble nerveux mais prêt pour l'aventure. Au loin, vous entendez le bruit de l'eau qui coule et peut-être... des voix ?",
        "options": [
            "Entrer dans la grotte immédiatement (peut-être un combat)",
            "Étudier les symboles étranges, peut-être une énigme",
            "Chercher une autre entrée autour de la montagne",
            "Se reposer et se préparer avant d'entrer",
            "Appeler pour voir si quelqu'un répond"
        ]
    }
};

const puzzle = {
    "spanish": {
        "type": "puzzle",
        "puzzle_type": "riddle",
        "text": "Un antiguo guardián bloquea tu camino. El golem de piedra habla en acertijos: 'Tengo llaves pero no cerraduras, espacio pero no habitaciones, puedes entrar pero no salir. ¿Qué soy?' Debes responder correctamente para pasar.",
        "answer": "keyboard",
        "hint": "Piensa en algo que usas para escribir...",
        "success": "¡Correcto! El golem se aparta, impresionado por tu sabiduría. Puedes pasar con seguridad.",
        "failure": "El golem niega con la cabeza. 'Intenta de nuevo, pequeño aventurero.'"
    },
    "french": {
        "type": "puzzle",
        "puzzle_type": "riddle", 
        "text": "Un gardien ancien bloque votre chemin. Le golem de pierre parle en énigmes : 'J'ai des touches mais pas de serrures, un espace mais pas de pièce, tu peux entrer mais pas sortir. Qu'est-ce que je suis ?' Vous devez répondre correctement pour passer.",
        "answer": "keyboard",
        "hint": "Pensez à quelque chose que vous utilisez pour écrire...",
        "success": "Correct ! Le golem s'écarte, impressionné par votre sagesse. Vous pouvez passer en toute sécurité.",
        "failure": "Le golem secoue la tête. 'Essayez encore, petit aventurier.'"
    }
};

const trader = {
    "spanish": {
        "type": "trading",
        "text": "Encuentras a un comerciante misterioso en el camino. El sabio mercader tiene muchos objetos valiosos para vender. Sus ojos brillan con codicia mientras examina tu oro. '¡Bienvenido, valiente aventurero!' dice con una sonrisa astuta. 'Tengo exactamente lo que necesitas para tu peligroso viaje.'"
    },
    "french": {
        "type": "trading",
        "text": "Vous trouvez un marchand mystérieux sur la route. Le sage commerçant possède de nombreux objets précieux à vendre. Ses yeux brillent de cupidité pendant qu'il examine votre or. 'Bienvenue, brave aventurier !' dit-il avec un sourire rusé. 'J'ai exactement ce qu'il vous faut pour votre voyage périlleux.'"
    }
};

const treasure = {
    "spanish": {
        "text": "¡Felicidades, valiente aventurero! Tras un largo y peligroso viaje, por fin has encontrado el tesoro legendario de Hic Sunt Dracones. El cofre antiguo se abre con una luz brillante, revelando no solo oro y gemas preciosas, sino también pergaminos que contienen un conocimiento poderoso. Tu sabio compañero está orgulloso de tu logro. Has demostrado que tienes el coraje y la sabiduría para ser un verdadero héroe. El pueblo celebrará tu victoria y tu nombre será recordado en las leyendas por generaciones.",
        "options": [
            "Regresar al pueblo como un héroe",
            "Explorar más misterios de este reino",
            "Compartir el tesoro con tu compañero",
            "Continuar la aventura en nuevas tierras"
        ]
    },
    "french": {
        "text": "Félicitations, brave aventurier ! Après un long et dangereux voyage, vous avez finalement trouvé le trésor légendaire de Hic Sunt Dracones. Le coffre ancien s'ouvre avec une lumière éclatante, révélant non seulement de l'or et des gemmes précieuses, mais aussi des parchemins renfermant un savoir puissant. Votre sage compagnon est fier de votre exploit. Vous avez montré que vous avez le courage et la sagesse d'un véritable héros. Le village célébrera votre victoire et votre nom sera évoqué dans les légendes pendant des générations.",
        "options": [
            "Retourner au village en héros",
            "Explorer davantage les mystères de ce royaume",
            "Partager le trésor avec votre compagnon",
            "Continuer l'aventure dans de nouvelles terres"
        ]
    }
};

const village = {
    "spanish": {
        "text": "Decides permanecer en el pueblo para reunir más información. Los amables aldeanos te cuentan antiguas leyendas sobre el tesoro. Una anciana te entrega un amuleto misterioso que dice que te protegerá durante tu peligroso viaje. El herrero del pueblo ofrece reforzar tu equipo, mientras que el sacerdote sabio comparte valiosos conocimientos sobre las criaturas que viven en la montaña y el bosque. Tu compañero disfruta de la atención y descansa.",
        "options": [
            "Aceptar el amuleto de la anciana",
            "Visitar al herrero para mejorar el equipo",
            "Escuchar más historias del sacerdote sabio",
            "Explorar otras partes del pueblo",
            "Visitar al anciano sabio en busca de consejo",
            "Buscar el acertijo de la biblioteca antigua",
            "Salir del pueblo ahora con nueva información"
        ]
    },
    "french": {
        "text": "Vous décidez de rester dans le village pour recueillir davantage d'informations. Les habitants amicaux vous racontent d'anciennes légendes sur le trésor. Une vieille femme vous remet une amulette mystérieuse qu'elle affirme vous protéger durant votre périlleux voyage. Le forgeron du village propose de renforcer votre équipement tandis que le prêtre sage partage de précieux savoirs sur les créatures vivant dans la montagne et la forêt. Votre compagnon profite de l'attention et se repose.",
        "options": [
            "Accepter l'amulette de la vieille femme",
            "Visiter le forgeron pour améliorer l'équipement",
            "Écouter plus d'histoires du prêtre sage",
            "Explorer d'autres parties du village",
            "Consulter le sage du village pour des conseils",
            "Chercher l'énigme de la bibliothèque ancienne",
            "Quitter le village maintenant avec de nouvelles informations"
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

// Map chapter names to their template objects for easy lookup
const chapterMap = {
  chapter1,
  combat,
  crafting,
  dialogue,
  wordquiz,
  intro,
  village,
  mountain,
  puzzle,
  trader,
  treasure,
  minigame,
};




















// Determine which examples to inject into the prompt
async function loadTemplates(chapter, language) {
  const textExamples = [chapter1, intro, village, mountain, treasure];

  const specialMap = {
    combat,
    crafting,
    dialogue,
    wordquiz,
    puzzle,
    trader,
    minigame,
  };

  let templates = specialMap[chapter] ? [specialMap[chapter]] : textExamples;

  // Only keep the currently selected language for each template
  return templates.map(t => ({ [language]: t[language] }));
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

// Save player's choice to context
function saveChoice(choiceText) {
  const context = getStoryContext();
  context.push({ chapter: 'choice', text: choiceText });
  localStorage.setItem('storyContext', JSON.stringify(context.slice(-20)));
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
async function generateStory(userInput, language = 'spanish', level = 'beginner') {
  const templates = await loadTemplates(userInput, language);
  const context = getContextTexts();

  // Build the prompt for AI
  const isSpecial = ['combat','crafting','dialogue','wordquiz','puzzle','trader','minigame'].includes(userInput);
  const prompt = `
You are a story generator. Respond exclusively in ${language}. The player's language level is ${level}. Adjust the vocabulary and complexity accordingly. Use the following examples as templates for your output format:
${templates.map((t, i) => `Example ${i + 1}:\n${JSON.stringify(t, null, 2)}`).join('\n\n')}
Available chapters: chapter1, combat, crafting, dialogue, wordquiz, intro, village, mountain, puzzle, trader, treasure, minigame.
${isSpecial ? '' : 'When creating a normal text card, provide five options and ensure one or two lead logically to special types such as combat, crafting, dialogue, wordquiz, puzzle, trader or minigame.'}
Continue the story in ${language}, keeping the style and format above. Here is the recent story context:
${context.join('\n')}
User input: ${userInput}
Please answer in JSON containing only the key \"${language}\" and ensure that the story continues logically from the last context.
  `;

  // Log the prompt sent to the AI
  console.log("Prompt sent to AI:", prompt);

  let aiText;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    aiText = data.choices[0].message.content.trim();
  } catch (err) {
    console.error('AI request failed:', err);
    const fallback = chapterMap[userInput];
    if (fallback && fallback[language]) {
      const fallbackObj = { [language]: fallback[language] };
      aiText = JSON.stringify(fallbackObj);
      saveToContext(userInput, aiText);
      return fallbackObj;
    }
    throw err;
  }

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
    // Attempt to strip extraneous characters outside of the JSON object
    const start = aiText.indexOf('{');
    const end = aiText.lastIndexOf('}');
    if (start !== -1 && end > start) {
      const cleaned = aiText.slice(start, end + 1);
      try {
        storyData = JSON.parse(cleaned);
        aiText = cleaned; // use cleaned JSON for context
      } catch (err) {
        console.error('Failed to parse cleaned AI response:', cleaned, err);
        console.error('Original AI response was:', aiText, e);
        storyData = { text: aiText };
      }
    } else {
      console.error('Failed to parse AI response as JSON:', aiText, e);
      storyData = { text: aiText }; // fallback object
    }
  }

  // Sanitize strings inside the parsed object to remove stray characters
  const sanitizeString = (str) =>
    str
      .replace(/\b[A-Za-z]*">/g, '')
      .replace(/[<>]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitizeObject(obj[key]);
      });
    }
    return obj;
  };

  storyData = sanitizeObject(storyData);
  aiText = JSON.stringify(storyData);

  saveToContext(userInput, aiText);
  return storyData;
}

export { generateStory, saveChoice };
