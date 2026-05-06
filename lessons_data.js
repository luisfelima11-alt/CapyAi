// Capy Yara Adventures — Lesson Trail Data
// 15 lessons across 3 XP tiers

const LESSONS = [
  // ─── TIER 1: Absolute Beginner (XP 0+) ────────────────────────────────────

  {
    id: 1,
    title: 'Greetings',
    emoji: '👋',
    xpRequired: 0,
    xpReward: 25,
    tier: 1,
    vocab: [
      { word: 'Hello',     emoji: '👋', pronunciation: '/həˈloʊ/',   hint: 'A greeting when you meet someone' },
      { word: 'Goodbye',   emoji: '🙋', pronunciation: '/ˌɡʊdˈbaɪ/', hint: 'What you say when leaving' },
      { word: 'Please',    emoji: '🙏', pronunciation: '/pliːz/',     hint: 'Use it to ask politely' },
      { word: 'Thank you', emoji: '😊', pronunciation: '/θæŋk juː/', hint: 'Show you are grateful' },
      { word: 'Sorry',     emoji: '😟', pronunciation: '/ˈsɒr.i/',   hint: 'Apologise for a mistake' },
    ],
    grammar: {
      title: 'How to Greet in English',
      rule: 'Say <b>Hello</b> + your name when you meet someone new.',
      examples: [
        'Hello, my name is <b>Luna</b>!',
        'Goodbye, see you <b>tomorrow</b>!',
        'Please pass the <b>juice</b>.',
      ],
    },
    fillBlanks: [
      { sentence: '___, my name is Yara.', answer: 'Hello',     distractors: ['Goodbye', 'Sorry', 'Run'] },
      { sentence: '___ for helping me!',   answer: 'Thank you', distractors: ['Hello', 'Please', 'Jump'] },
      { sentence: 'I am ___. I dropped the cup.', answer: 'Sorry', distractors: ['Happy', 'Please', 'Thank you'] },
    ],
    sentences: [
      { words: ['Hello,', 'my', 'name', 'is', 'Yara!'], emoji: '👋', hint: 'Introduce yourself!' },
      { words: ['Please', 'help', 'me.'], emoji: '🙏', hint: 'Ask politely!' },
    ],
  },

  {
    id: 2,
    title: 'Colors',
    emoji: '🎨',
    xpRequired: 0,
    xpReward: 25,
    tier: 1,
    vocab: [
      { word: 'Red',    emoji: '🔴', pronunciation: '/rɛd/',    hint: 'The color of apples and fire' },
      { word: 'Blue',   emoji: '🔵', pronunciation: '/bluː/',   hint: 'The color of the sky and ocean' },
      { word: 'Green',  emoji: '🟢', pronunciation: '/ɡriːn/', hint: 'The color of grass and trees' },
      { word: 'Yellow', emoji: '🟡', pronunciation: '/ˈjɛl.oʊ/', hint: 'The color of the sun and bananas' },
      { word: 'Pink',   emoji: '🩷', pronunciation: '/pɪŋk/',  hint: 'A soft, light red color' },
    ],
    grammar: {
      title: 'Describing Colors',
      rule: 'Use "The ___ is [color]" to describe the color of something.',
      examples: [
        'The apple is <b>red</b>.',
        'The sky is <b>blue</b>.',
        'The frog is <b>green</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'The sky is ___.', answer: 'Blue',   distractors: ['Red', 'Pink', 'Hello'] },
      { sentence: 'The apple is ___.', answer: 'Red', distractors: ['Blue', 'Green', 'Sorry'] },
      { sentence: 'The grass is ___.', answer: 'Green', distractors: ['Yellow', 'Red', 'Pink'] },
    ],
    sentences: [
      { words: ['The', 'sky', 'is', 'blue.'], emoji: '🔵', hint: 'What color is the sky?' },
      { words: ['The', 'flower', 'is', 'pink.'], emoji: '🩷', hint: 'Describe the flower!' },
    ],
  },

  {
    id: 3,
    title: 'Numbers 1–5',
    emoji: '🔢',
    xpRequired: 0,
    xpReward: 25,
    tier: 1,
    vocab: [
      { word: 'One',   emoji: '1️⃣', pronunciation: '/wʌn/',  hint: 'The number 1' },
      { word: 'Two',   emoji: '2️⃣', pronunciation: '/tuː/',  hint: 'The number 2' },
      { word: 'Three', emoji: '3️⃣', pronunciation: '/θriː/', hint: 'The number 3' },
      { word: 'Four',  emoji: '4️⃣', pronunciation: '/fɔːr/', hint: 'The number 4' },
      { word: 'Five',  emoji: '5️⃣', pronunciation: '/faɪv/', hint: 'The number 5' },
    ],
    grammar: {
      title: 'Counting with Numbers',
      rule: 'Use "I have ___ [noun]" to say how many things you have.',
      examples: [
        'I have <b>one</b> cat.',
        'I have <b>three</b> books.',
        'I have <b>five</b> apples.',
      ],
    },
    fillBlanks: [
      { sentence: 'I have ___ cat.', answer: 'one',   distractors: ['two', 'five', 'Hello'] },
      { sentence: 'She has ___ dogs.', answer: 'three', distractors: ['one', 'four', 'blue'] },
      { sentence: 'There are ___ stars.', answer: 'five', distractors: ['two', 'three', 'red'] },
    ],
    sentences: [
      { words: ['I', 'have', 'two', 'cats.'], emoji: '🐱', hint: 'How many cats?' },
      { words: ['There', 'are', 'four', 'birds.'], emoji: '🐦', hint: 'Count the birds!' },
    ],
  },

  {
    id: 4,
    title: 'Animals',
    emoji: '🐾',
    xpRequired: 0,
    xpReward: 25,
    tier: 1,
    vocab: [
      { word: 'Cat',    emoji: '🐱', pronunciation: '/kæt/',    hint: 'A furry pet that says meow' },
      { word: 'Dog',    emoji: '🐶', pronunciation: '/dɒɡ/',    hint: 'A loyal pet that barks' },
      { word: 'Bird',   emoji: '🐦', pronunciation: '/bɜːrd/',  hint: 'An animal with wings that can fly' },
      { word: 'Fish',   emoji: '🐟', pronunciation: '/fɪʃ/',    hint: 'An animal that lives in water' },
      { word: 'Rabbit', emoji: '🐰', pronunciation: '/ˈræb.ɪt/', hint: 'A fluffy animal with long ears' },
    ],
    grammar: {
      title: 'What Animals Can Do',
      rule: 'Use "The ___ can [verb]" to say what an animal is able to do.',
      examples: [
        'The bird can <b>fly</b>.',
        'The dog can <b>run</b>.',
        'The fish can <b>swim</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'The bird can ___.', answer: 'fly',  distractors: ['swim', 'bark', 'read'] },
      { sentence: 'The dog can ___.', answer: 'bark', distractors: ['fly', 'swim', 'blue'] },
      { sentence: 'The fish can ___.', answer: 'swim', distractors: ['fly', 'run', 'one'] },
    ],
    sentences: [
      { words: ['The', 'cat', 'can', 'run.'], emoji: '🐱', hint: 'What can the cat do?' },
      { words: ['The', 'rabbit', 'is', 'fluffy.'], emoji: '🐰', hint: 'Describe the rabbit!' },
    ],
  },

  {
    id: 5,
    title: 'Family',
    emoji: '👨‍👩‍👧',
    xpRequired: 0,
    xpReward: 25,
    tier: 1,
    vocab: [
      { word: 'Mom',     emoji: '👩', pronunciation: '/mɒm/',    hint: 'Your female parent' },
      { word: 'Dad',     emoji: '👨', pronunciation: '/dæd/',    hint: 'Your male parent' },
      { word: 'Sister',  emoji: '👧', pronunciation: '/ˈsɪs.tər/', hint: 'A girl in your family' },
      { word: 'Brother', emoji: '👦', pronunciation: '/ˈbrʌð.ər/', hint: 'A boy in your family' },
      { word: 'Baby',    emoji: '👶', pronunciation: '/ˈbeɪ.bi/', hint: 'A very young child' },
    ],
    grammar: {
      title: 'Possessive: My Family',
      rule: 'Use <b>My ___ is called ___</b> to introduce your family member.',
      examples: [
        'My mom is called <b>Maria</b>.',
        'My brother is called <b>Leo</b>.',
        'My sister is called <b>Zoe</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'My ___ is called Maria.', answer: 'mom',     distractors: ['dad', 'fish', 'red'] },
      { sentence: 'My ___ is called Leo.',   answer: 'brother', distractors: ['sister', 'baby', 'dog'] },
      { sentence: 'My ___ is very small.',   answer: 'baby',    distractors: ['mom', 'dad', 'cat'] },
    ],
    sentences: [
      { words: ['My', 'mom', 'is', 'called', 'Yara.'], emoji: '👩', hint: 'Say your mom\'s name!' },
      { words: ['My', 'brother', 'is', 'funny.'], emoji: '👦', hint: 'Describe your brother!' },
    ],
  },

  // ─── TIER 2: Elementary (XP 100+) ─────────────────────────────────────────

  {
    id: 6,
    title: 'Food & Drink',
    emoji: '🍎',
    xpRequired: 100,
    xpReward: 30,
    tier: 2,
    vocab: [
      { word: 'Apple', emoji: '🍎', pronunciation: '/ˈæp.əl/', hint: 'A sweet round fruit' },
      { word: 'Bread', emoji: '🍞', pronunciation: '/brɛd/',   hint: 'A baked food made from flour' },
      { word: 'Water', emoji: '💧', pronunciation: '/ˈwɔː.tər/', hint: 'A clear drink you need every day' },
      { word: 'Milk',  emoji: '🥛', pronunciation: '/mɪlk/',   hint: 'A white drink from cows' },
      { word: 'Cake',  emoji: '🎂', pronunciation: '/keɪk/',   hint: 'A sweet baked treat for celebrations' },
    ],
    grammar: {
      title: 'Likes and Dislikes',
      rule: 'Use <b>I like ___</b> or <b>I don\'t like ___</b> to express preferences.',
      examples: [
        'I like <b>apples</b>.',
        'I don\'t like <b>bread</b>.',
        'She likes <b>cake</b> very much!',
      ],
    },
    fillBlanks: [
      { sentence: 'I like ___.', answer: 'cake',  distractors: ['run', 'hello', 'blue'] },
      { sentence: 'I don\'t like ___.', answer: 'milk', distractors: ['fly', 'red', 'five'] },
      { sentence: 'She likes ___ every morning.', answer: 'bread', distractors: ['water', 'swim', 'three'] },
    ],
    sentences: [
      { words: ['I', 'like', 'apples', 'and', 'cake.'], emoji: '🍎', hint: 'What food do you like?' },
      { words: ['I', 'don\'t', 'like', 'milk.'], emoji: '🥛', hint: 'What don\'t you like?' },
    ],
  },

  {
    id: 7,
    title: 'Body Parts',
    emoji: '🦷',
    xpRequired: 100,
    xpReward: 30,
    tier: 2,
    vocab: [
      { word: 'Head',  emoji: '🧠', pronunciation: '/hɛd/',  hint: 'The top part of your body' },
      { word: 'Eyes',  emoji: '👀', pronunciation: '/aɪz/',  hint: 'You use these to see' },
      { word: 'Hands', emoji: '🤲', pronunciation: '/hændz/', hint: 'You use these to hold things' },
      { word: 'Feet',  emoji: '🦶', pronunciation: '/fiːt/', hint: 'You stand and walk on these' },
      { word: 'Nose',  emoji: '👃', pronunciation: '/noʊz/', hint: 'You use this to smell things' },
    ],
    grammar: {
      title: 'Plurals: I have two ___',
      rule: 'Use <b>I have two ___</b> to talk about body parts that come in pairs.',
      examples: [
        'I have two <b>eyes</b>.',
        'I have two <b>hands</b>.',
        'I have two <b>feet</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'I have two ___.', answer: 'eyes',  distractors: ['head', 'nose', 'cake'] },
      { sentence: 'My ___ are cold.', answer: 'feet', distractors: ['eyes', 'nose', 'milk'] },
      { sentence: 'She washed her ___.', answer: 'hands', distractors: ['head', 'feet', 'apple'] },
    ],
    sentences: [
      { words: ['I', 'have', 'two', 'eyes.'], emoji: '👀', hint: 'Describe your eyes!' },
      { words: ['My', 'hands', 'are', 'warm.'], emoji: '🤲', hint: 'Describe your hands!' },
    ],
  },

  {
    id: 8,
    title: 'Actions',
    emoji: '🏃',
    xpRequired: 100,
    xpReward: 30,
    tier: 2,
    vocab: [
      { word: 'Run',   emoji: '🏃', pronunciation: '/rʌn/',   hint: 'Move your legs very fast' },
      { word: 'Jump',  emoji: '🦘', pronunciation: '/dʒʌmp/', hint: 'Push yourself up from the ground' },
      { word: 'Eat',   emoji: '😋', pronunciation: '/iːt/',   hint: 'Put food in your mouth' },
      { word: 'Sleep', emoji: '😴', pronunciation: '/sliːp/', hint: 'Rest with your eyes closed at night' },
      { word: 'Play',  emoji: '🎮', pronunciation: '/pleɪ/',  hint: 'Have fun with games or toys' },
    ],
    grammar: {
      title: 'Present Simple: Everyday Actions',
      rule: 'Use <b>I [verb] every day</b> to talk about habits and routines.',
      examples: [
        'I <b>run</b> every day.',
        'I <b>eat</b> breakfast in the morning.',
        'We <b>play</b> after school.',
      ],
    },
    fillBlanks: [
      { sentence: 'I ___ every morning.', answer: 'run',  distractors: ['cake', 'blue', 'fish'] },
      { sentence: 'She likes to ___ outside.', answer: 'play', distractors: ['sleep', 'run', 'eat'] },
      { sentence: 'I ___ at 9 o\'clock at night.', answer: 'sleep', distractors: ['jump', 'play', 'run'] },
    ],
    sentences: [
      { words: ['I', 'run', 'every', 'day.'], emoji: '🏃', hint: 'What do you do every day?' },
      { words: ['We', 'play', 'after', 'school.'], emoji: '🎮', hint: 'When do you play?' },
    ],
  },

  {
    id: 9,
    title: 'Weather',
    emoji: '⛅',
    xpRequired: 100,
    xpReward: 30,
    tier: 2,
    vocab: [
      { word: 'Sun',   emoji: '☀️', pronunciation: '/sʌn/',   hint: 'The bright star that gives us light and warmth' },
      { word: 'Rain',  emoji: '🌧️', pronunciation: '/reɪn/',  hint: 'Water that falls from clouds' },
      { word: 'Cloud', emoji: '☁️', pronunciation: '/klaʊd/', hint: 'A white or grey shape in the sky' },
      { word: 'Wind',  emoji: '💨', pronunciation: '/wɪnd/',  hint: 'Moving air you can feel on your face' },
      { word: 'Snow',  emoji: '❄️', pronunciation: '/snoʊ/',  hint: 'White frozen water that falls in winter' },
    ],
    grammar: {
      title: 'Describing Today\'s Weather',
      rule: 'Use <b>Today it is ___</b> + an adjective to describe the weather.',
      examples: [
        'Today it is <b>sunny</b>.',
        'Today it is <b>cloudy</b>.',
        'Today it is <b>cold</b> and <b>windy</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'Today it is ___.', answer: 'sunny',  distractors: ['swim', 'eat', 'run'] },
      { sentence: 'I need an umbrella because there is ___.', answer: 'rain', distractors: ['sun', 'snow', 'jump'] },
      { sentence: 'In winter, it often ___.', answer: 'snows', distractors: ['rains', 'plays', 'sleeps'] },
    ],
    sentences: [
      { words: ['Today', 'it', 'is', 'sunny.'], emoji: '☀️', hint: 'Describe today\'s weather!' },
      { words: ['The', 'wind', 'is', 'cold.'], emoji: '💨', hint: 'How is the wind?' },
    ],
  },

  {
    id: 10,
    title: 'My House',
    emoji: '🏠',
    xpRequired: 100,
    xpReward: 30,
    tier: 2,
    vocab: [
      { word: 'Door',   emoji: '🚪', pronunciation: '/dɔːr/',   hint: 'You open this to enter a room' },
      { word: 'Window', emoji: '🪟', pronunciation: '/ˈwɪn.doʊ/', hint: 'A glass opening in a wall for light' },
      { word: 'Table',  emoji: '🪑', pronunciation: '/ˈteɪ.bəl/', hint: 'You put things on this flat surface' },
      { word: 'Chair',  emoji: '🪑', pronunciation: '/tʃɛr/',    hint: 'You sit on this' },
      { word: 'Bed',    emoji: '🛏️', pronunciation: '/bɛd/',     hint: 'You sleep on this at night' },
    ],
    grammar: {
      title: 'There is / There are',
      rule: 'Use <b>There is</b> for one thing and <b>There are</b> for more than one.',
      examples: [
        'There is a <b>door</b> in the room.',
        'There are two <b>windows</b>.',
        'There is a big <b>bed</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'There is a ___ in my room.', answer: 'bed',    distractors: ['run', 'swim', 'eat'] },
      { sentence: 'There are two ___ at the table.', answer: 'chairs', distractors: ['door', 'bed', 'window'] },
      { sentence: 'I can see the garden through the ___.', answer: 'window', distractors: ['door', 'table', 'chair'] },
    ],
    sentences: [
      { words: ['There', 'is', 'a', 'big', 'bed.'], emoji: '🛏️', hint: 'Describe the bedroom!' },
      { words: ['There', 'are', 'two', 'chairs.'], emoji: '🪑', hint: 'How many chairs are there?' },
    ],
  },

  // ─── TIER 3: Pre-Elementary (XP 200+) ─────────────────────────────────────

  {
    id: 11,
    title: 'Feelings',
    emoji: '😊',
    xpRequired: 200,
    xpReward: 40,
    tier: 3,
    vocab: [
      { word: 'Happy',     emoji: '😊', pronunciation: '/ˈhæp.i/',     hint: 'Feeling full of joy' },
      { word: 'Sad',       emoji: '😢', pronunciation: '/sæd/',         hint: 'Feeling unhappy or upset' },
      { word: 'Angry',     emoji: '😠', pronunciation: '/ˈæŋ.ɡri/',    hint: 'Feeling very cross' },
      { word: 'Scared',    emoji: '😨', pronunciation: '/skɛrd/',       hint: 'Feeling afraid of something' },
      { word: 'Surprised', emoji: '😲', pronunciation: '/sərˈpraɪzd/', hint: 'Feeling shocked by something unexpected' },
    ],
    grammar: {
      title: 'Expressing Feelings',
      rule: 'Use <b>I feel ___ because ___</b> to explain your emotions.',
      examples: [
        'I feel <b>happy</b> because I won the game.',
        'I feel <b>sad</b> because my friend left.',
        'I feel <b>scared</b> because of the dark.',
      ],
    },
    fillBlanks: [
      { sentence: 'I feel ___ because I got a gift!', answer: 'happy',     distractors: ['sad', 'angry', 'scared'] },
      { sentence: 'She feels ___ because she lost her toy.', answer: 'sad', distractors: ['happy', 'surprised', 'scared'] },
      { sentence: 'I was ___ by the loud noise.', answer: 'surprised',      distractors: ['happy', 'angry', 'sad'] },
    ],
    sentences: [
      { words: ['I', 'feel', 'happy', 'today.'], emoji: '😊', hint: 'How do you feel?' },
      { words: ['She', 'is', 'scared', 'of', 'spiders.'], emoji: '😨', hint: 'What is she scared of?' },
    ],
  },

  {
    id: 12,
    title: 'School',
    emoji: '🏫',
    xpRequired: 200,
    xpReward: 40,
    tier: 3,
    vocab: [
      { word: 'Pen',     emoji: '🖊️', pronunciation: '/pɛn/',      hint: 'You write with this' },
      { word: 'Book',    emoji: '📚', pronunciation: '/bʊk/',      hint: 'You read this to learn' },
      { word: 'Teacher', emoji: '👩‍🏫', pronunciation: '/ˈtiː.tʃər/', hint: 'A person who helps you learn' },
      { word: 'Friend',  emoji: '🤝', pronunciation: '/frɛnd/',    hint: 'Someone you like and play with' },
      { word: 'Learn',   emoji: '🧠', pronunciation: '/lɜːrn/',    hint: 'To get new knowledge or skills' },
    ],
    grammar: {
      title: 'We / They at School',
      rule: 'Use <b>We ___ at school</b> or <b>They ___</b> to talk about group activities.',
      examples: [
        'We <b>learn</b> at school.',
        'We <b>read</b> books every day.',
        'They <b>play</b> with their friends.',
      ],
    },
    fillBlanks: [
      { sentence: 'We ___ English at school.', answer: 'learn', distractors: ['sleep', 'fly', 'swim'] },
      { sentence: 'They read a ___ together.', answer: 'book', distractors: ['pen', 'friend', 'rain'] },
      { sentence: 'My ___ helps me read.', answer: 'teacher', distractors: ['friend', 'book', 'pen'] },
    ],
    sentences: [
      { words: ['We', 'learn', 'at', 'school.'], emoji: '🏫', hint: 'What do you do at school?' },
      { words: ['My', 'teacher', 'is', 'kind.'], emoji: '👩‍🏫', hint: 'Describe your teacher!' },
    ],
  },

  {
    id: 13,
    title: 'Transport',
    emoji: '🚗',
    xpRequired: 200,
    xpReward: 40,
    tier: 3,
    vocab: [
      { word: 'Car',   emoji: '🚗', pronunciation: '/kɑːr/', hint: 'A vehicle with 4 wheels and an engine' },
      { word: 'Bus',   emoji: '🚌', pronunciation: '/bʌs/',  hint: 'A big vehicle that carries many people' },
      { word: 'Bike',  emoji: '🚲', pronunciation: '/baɪk/', hint: 'A vehicle you pedal with your feet' },
      { word: 'Train', emoji: '🚂', pronunciation: '/treɪn/', hint: 'A vehicle that runs on rails' },
      { word: 'Plane', emoji: '✈️', pronunciation: '/pleɪn/', hint: 'A vehicle that flies in the sky' },
    ],
    grammar: {
      title: 'Getting Around: I go by ___',
      rule: 'Use <b>I go to ___ by ___</b> to say how you travel somewhere.',
      examples: [
        'I go to school <b>by bus</b>.',
        'She goes to the park <b>by bike</b>.',
        'We travel to Spain <b>by plane</b>.',
      ],
    },
    fillBlanks: [
      { sentence: 'I go to school by ___.', answer: 'bus',   distractors: ['plane', 'happy', 'learn'] },
      { sentence: 'She travels to Paris by ___.', answer: 'plane', distractors: ['car', 'bus', 'bike'] },
      { sentence: 'My dad drives to work by ___.', answer: 'car', distractors: ['train', 'plane', 'bike'] },
    ],
    sentences: [
      { words: ['I', 'go', 'to', 'school', 'by', 'bus.'], emoji: '🚌', hint: 'How do you get to school?' },
      { words: ['We', 'travel', 'by', 'plane.'], emoji: '✈️', hint: 'How do you travel far?' },
    ],
  },

  {
    id: 14,
    title: 'Nature',
    emoji: '🌿',
    xpRequired: 200,
    xpReward: 40,
    tier: 3,
    vocab: [
      { word: 'Tree',     emoji: '🌳', pronunciation: '/triː/',      hint: 'A tall plant with a trunk and branches' },
      { word: 'Flower',   emoji: '🌸', pronunciation: '/ˈflaʊ.ər/', hint: 'A colorful plant part that blooms' },
      { word: 'River',    emoji: '🏞️', pronunciation: '/ˈrɪv.ər/',  hint: 'A long flow of water' },
      { word: 'Mountain', emoji: '⛰️', pronunciation: '/ˈmaʊn.tɪn/', hint: 'A very tall rocky hill' },
      { word: 'Sky',      emoji: '🌤️', pronunciation: '/skaɪ/',     hint: 'The space above us, often blue' },
    ],
    grammar: {
      title: 'Articles: a, an, the',
      rule: 'Use <b>a</b> before consonants, <b>an</b> before vowels, <b>the</b> for specific things.',
      examples: [
        'I see <b>a</b> tree.',
        'There is <b>an</b> apple on the tree.',
        'Look at <b>the</b> mountain!',
      ],
    },
    fillBlanks: [
      { sentence: 'I climbed ___ mountain.', answer: 'the', distractors: ['a', 'an', 'some'] },
      { sentence: 'I can see ___ eagle.', answer: 'an',  distractors: ['a', 'the', 'some'] },
      { sentence: 'There is ___ flower in the garden.', answer: 'a', distractors: ['an', 'the', 'some'] },
    ],
    sentences: [
      { words: ['I', 'see', 'a', 'tall', 'tree.'], emoji: '🌳', hint: 'Describe the tree!' },
      { words: ['The', 'sky', 'is', 'very', 'blue.'], emoji: '🌤️', hint: 'Describe the sky!' },
    ],
  },

  {
    id: 15,
    title: 'Time',
    emoji: '⏰',
    xpRequired: 200,
    xpReward: 40,
    tier: 3,
    vocab: [
      { word: 'Morning',   emoji: '🌅', pronunciation: '/ˈmɔːr.nɪŋ/',   hint: 'The first part of the day' },
      { word: 'Afternoon', emoji: '🌤️', pronunciation: '/ˌæf.tərˈnuːn/', hint: 'The middle part of the day after noon' },
      { word: 'Night',     emoji: '🌙', pronunciation: '/naɪt/',          hint: 'When it is dark and you sleep' },
      { word: 'Today',     emoji: '📅', pronunciation: '/təˈdeɪ/',        hint: 'This current day' },
      { word: 'Tomorrow',  emoji: '🗓️', pronunciation: '/təˈmɒr.oʊ/',   hint: 'The day after today' },
    ],
    grammar: {
      title: 'Time Expressions in Sentences',
      rule: 'Put time expressions <b>at the start or end</b> of a sentence.',
      examples: [
        '<b>In the morning</b>, I eat breakfast.',
        'I do my homework <b>in the afternoon</b>.',
        '<b>Tomorrow</b>, we will go to the park.',
      ],
    },
    fillBlanks: [
      { sentence: 'In the ___, I eat breakfast.', answer: 'morning',   distractors: ['night', 'today', 'car'] },
      { sentence: '___, we will go to the park.', answer: 'Tomorrow',  distractors: ['Night', 'Morning', 'Today'] },
      { sentence: 'I go to sleep at ___.', answer: 'night', distractors: ['morning', 'today', 'tomorrow'] },
    ],
    sentences: [
      { words: ['In', 'the', 'morning,', 'I', 'run.'], emoji: '🌅', hint: 'What do you do in the morning?' },
      { words: ['Tomorrow', 'is', 'a', 'sunny', 'day.'], emoji: '🗓️', hint: 'Predict tomorrow\'s weather!' },
    ],
  },
];
