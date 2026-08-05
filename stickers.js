// ================================================================
//  StickerVersz — stickers.js
//  THIS IS THE ONLY FILE YOU NEED TO EDIT to manage stickers.
// ================================================================
//
//  HOW TO ADD A STICKER — copy any line and change the values:
//
//    { id: 'AN-016', name: 'My Sticker', category: 'anime', emoji: '⭐' },
//
//  ADD A "NEW" BADGE:
//    { ..., isNew: true },
//
//  USE YOUR OWN IMAGE (put the file in the images/ folder):
//    { ..., image: 'images/my-sticker.png' },
//
//  CHANGE THE PRICE (default is 1 MAD):
//    { ..., price: 2 },
//
//  AVAILABLE CATEGORIES:
//    anime · kpop · gaming · sports · movies · music · study · manga · cars · memes · quotes
//
// ================================================================

const STICKERS = [

  // ── ANIME ────────────────────────────────────────────────────
  { id: 'AN-001', name: 'Gojo Satoru',      category: 'anime',  emoji: '🔵', isNew: true  },
  { id: 'AN-002', name: 'killua', category: 'anime', emoji: '🦊', image: 'images/naruto.png' },
  { id: 'AN-003', name: 'Monkey D. Luffy',  category: 'anime',  emoji: '🔴' ,image: 'images/luffy.png' },
  { id: 'AN-004', name: 'Tanjiro Kamado',   category: 'anime',  emoji: '🌊', isNew: true  },
  { id: 'AN-005', name: 'Levi Ackerman',    category: 'anime',  emoji: '⚔️'               },
  { id: 'AN-006', name: 'Zero Two',         category: 'anime',  emoji: '🌸'               },
  { id: 'AN-007', name: 'Itachi Uchiha',    category: 'anime',  emoji: '👁️'               },
  { id: 'AN-008', name: 'Todoroki Shoto',   category: 'anime',  emoji: '🧊', isNew: true  },
  { id: 'AN-009', name: 'Mikasa Ackerman',  category: 'anime',  emoji: '🎀'               },
  { id: 'AN-010', name: 'Killua Zoldyck',   category: 'anime',  emoji: '⚡'               },
  { id: 'AN-011', name: 'Nezuko Kamado',    category: 'anime',  emoji: '💗', isNew: true  },
  { id: 'AN-012', name: 'Kakashi Hatake',   category: 'anime',  emoji: '📖'               },
  { id: 'AN-013', name: 'Anya Forger',      category: 'anime',  emoji: '😶', isNew: true  },
  { id: 'AN-014', name: 'Rem',              category: 'anime',  emoji: '🔔'               },
  { id: 'AN-015', name: 'Edward Elric',     category: 'anime',  emoji: '✨'               },

  // ── K-POP ────────────────────────────────────────────────────
  { id: 'KP-001', name: 'BTS Logo',         category: 'kpop',   emoji: '💜'               },
  { id: 'KP-002', name: 'BLACKPINK',        category: 'kpop',   emoji: '🖤'               },
  { id: 'KP-003', name: 'Jungkook',         category: 'kpop',   emoji: '⭐', isNew: true  },
  { id: 'KP-004', name: 'TWICE',            category: 'kpop',   emoji: '🍭'               },
  { id: 'KP-005', name: 'Stray Kids',       category: 'kpop',   emoji: '💫', isNew: true  },
  { id: 'KP-006', name: 'NewJeans',         category: 'kpop',   emoji: '🐇', isNew: true  },
  { id: 'KP-007', name: '(G)I-DLE',         category: 'kpop',   emoji: '🌹'               },
  { id: 'KP-008', name: 'EXO Logo',         category: 'kpop',   emoji: '🌙'               },
  { id: 'KP-009', name: 'aespa Karina',     category: 'kpop',   emoji: '🤖', isNew: true  },
  { id: 'KP-010', name: 'SEVENTEEN',        category: 'kpop',   emoji: '💎'               },

  // ── GAMING ───────────────────────────────────────────────────
  { id: 'GM-001', name: 'Among Us Red',     category: 'gaming', emoji: '🔴'               },
  { id: 'GM-002', name: 'Minecraft Diamond',category: 'gaming', emoji: '💎'               },
  { id: 'GM-003', name: 'Valorant Logo',    category: 'gaming', emoji: '🎯', isNew: true  },
  { id: 'GM-004', name: 'League of Legends',category: 'gaming', emoji: '⚔️'               },
  { id: 'GM-005', name: 'CS2 Logo',         category: 'gaming', emoji: '💥', isNew: true  },
  { id: 'GM-006', name: 'Pokéball',         category: 'gaming', emoji: '⚪'               },
  { id: 'GM-007', name: 'Pac-Man',          category: 'gaming', emoji: '🟡'               },
  { id: 'GM-008', name: 'Fortnite Llama',   category: 'gaming', emoji: '🦙'               },
  { id: 'GM-009', name: 'Game Controller',  category: 'gaming', emoji: '🎮'               },
  { id: 'GM-010', name: 'Zelda Triforce',   category: 'gaming', emoji: '🔺', isNew: true  },
  { id: 'GM-011', name: 'Minecraft Creeper',category: 'gaming', emoji: '💚'               },
  { id: 'GM-012', name: 'GTA Logo',         category: 'gaming', emoji: '🌃', isNew: true  },

  // ── SPORTS ───────────────────────────────────────────────────
  { id: 'SP-001', name: 'Soccer Ball',      category: 'sports', emoji: '⚽'               },
  { id: 'SP-002', name: 'Basketball',       category: 'sports', emoji: '🏀'               },
  { id: 'SP-003', name: 'Real Madrid',      category: 'sports', emoji: '👑'               },
  { id: 'SP-004', name: 'FC Barcelona',     category: 'sports', emoji: '🔵'               },
  { id: 'SP-005', name: 'Tennis Racket',    category: 'sports', emoji: '🎾'               },
  { id: 'SP-006', name: 'Boxing Gloves',    category: 'sports', emoji: '🥊', isNew: true  },
  { id: 'SP-007', name: 'NBA Logo',         category: 'sports', emoji: '🏀'               },
  { id: 'SP-008', name: 'Formula 1 Car',    category: 'sports', emoji: '🏎️', isNew: true  },
  { id: 'SP-009', name: 'PSG Logo',         category: 'sports', emoji: '🗼'               },
  { id: 'SP-010', name: 'Manchester United',category: 'sports', emoji: '👹'               },

  // ── MOVIES ───────────────────────────────────────────────────
  { id: 'MV-001', name: 'Spider-Man',       category: 'movies', emoji: '🕷️'               },
  { id: 'MV-002', name: 'Iron Man',         category: 'movies', emoji: '🔴'               },
  { id: 'MV-003', name: 'The Joker',        category: 'movies', emoji: '🃏', isNew: true  },
  { id: 'MV-004', name: 'Darth Vader',      category: 'movies', emoji: '🌑'               },
  { id: 'MV-005', name: 'Batman Logo',      category: 'movies', emoji: '🦇'               },
  { id: 'MV-006', name: 'Avengers Logo',    category: 'movies', emoji: '⚡'               },
  { id: 'MV-007', name: 'Thanos',           category: 'movies', emoji: '💜'               },
  { id: 'MV-008', name: 'Venom',            category: 'movies', emoji: '🖤', isNew: true  },
  { id: 'MV-009', name: 'Godzilla',         category: 'movies', emoji: '🦕'               },
  { id: 'MV-010', name: 'Black Panther',    category: 'movies', emoji: '🐾'               },

  // ── MUSIC ────────────────────────────────────────────────────
  { id: 'MU-001', name: 'Microphone',       category: 'music',  emoji: '🎤'               },
  { id: 'MU-002', name: 'Electric Guitar',  category: 'music',  emoji: '🎸'               },
  { id: 'MU-003', name: 'Vinyl Record',     category: 'music',  emoji: '💿'               },
  { id: 'MU-004', name: 'The Weeknd',       category: 'music',  emoji: '🌙', isNew: true  },
  { id: 'MU-005', name: 'Travis Scott',     category: 'music',  emoji: '🌌'               },
  { id: 'MU-006', name: 'Headphones',       category: 'music',  emoji: '🎧'               },
  { id: 'MU-007', name: 'Piano Keys',       category: 'music',  emoji: '🎹'               },
  { id: 'MU-008', name: 'Drake OVO',        category: 'music',  emoji: '🦉', isNew: true  },
  { id: 'MU-009', name: 'Music Notes',      category: 'music',  emoji: '🎵'               },
  { id: 'MU-010', name: 'Kanye West',       category: 'music',  emoji: '🎤'               },

  // ── STUDY ────────────────────────────────────────────────────
  { id: 'ST-001', name: 'Coffee Cup',       category: 'study',  emoji: '☕'               },
  { id: 'ST-002', name: 'Books Stack',      category: 'study',  emoji: '📚'               },
  { id: 'ST-003', name: 'Study Pencil',     category: 'study',  emoji: '✏️'               },
  { id: 'ST-004', name: 'Aesthetic Laptop', category: 'study',  emoji: '💻', isNew: true  },
  { id: 'ST-005', name: 'Plant & Notebook', category: 'study',  emoji: '🌿'               },
  { id: 'ST-006', name: 'Alarm Clock',      category: 'study',  emoji: '⏰'               },
  { id: 'ST-007', name: 'Star Notes',       category: 'study',  emoji: '⭐'               },
  { id: 'ST-008', name: 'Motivation',       category: 'study',  emoji: '✨', isNew: true  },

  // ── MANGA ────────────────────────────────────────────────────
  { id: 'MG-001', name: 'Dragon Ball Logo', category: 'manga',  emoji: '🐉'               },
  { id: 'MG-002', name: 'One Piece Logo',   category: 'manga',  emoji: '☠️'               },
  { id: 'MG-003', name: 'Naruto Leaf',      category: 'manga',  emoji: '🍃'               },
  { id: 'MG-004', name: 'Bleach Skull',     category: 'manga',  emoji: '💀', isNew: true  },
  { id: 'MG-005', name: 'Jujutsu Kaisen',   category: 'manga',  emoji: '🌀', isNew: true  },
  { id: 'MG-006', name: 'AOT Wings',        category: 'manga',  emoji: '🦅'               },
  { id: 'MG-007', name: 'Death Note',       category: 'manga',  emoji: '📓'               },
  { id: 'MG-008', name: 'Fullmetal Logo',   category: 'manga',  emoji: '⚗️'               },

  // ── CARS ─────────────────────────────────────────────────────
  { id: 'CR-001', name: 'JDM Drift Car',    category: 'cars',   emoji: '🏎️'               },
  { id: 'CR-002', name: 'Lamborghini',      category: 'cars',   emoji: '🐂'               },
  { id: 'CR-003', name: 'BMW M Logo',       category: 'cars',   emoji: '💙', isNew: true  },
  { id: 'CR-004', name: 'Ferrari Prancing', category: 'cars',   emoji: '🐎'               },
  { id: 'CR-005', name: 'Toyota Supra',     category: 'cars',   emoji: '🚗', isNew: true  },
  { id: 'CR-006', name: 'Nissan GT-R',      category: 'cars',   emoji: '⚡'               },
  { id: 'CR-007', name: 'Racing Flames',    category: 'cars',   emoji: '🔥'               },
  { id: 'CR-008', name: 'Stance Car',       category: 'cars',   emoji: '🚙'               },
  { id: 'CR-009', name: 'Porsche Logo',     category: 'cars',   emoji: '🐴', isNew: true  },

  // ── MEMES ────────────────────────────────────────────────────
  { id: 'ME-001', name: 'Doge',             category: 'memes',  emoji: '🐕'               },
  { id: 'ME-002', name: 'Trollface',        category: 'memes',  emoji: '😈'               },
  { id: 'ME-003', name: 'Shrek',            category: 'memes',  emoji: '🌿'               },
  { id: 'ME-004', name: 'GigaChad',         category: 'memes',  emoji: '💪', isNew: true  },
  { id: 'ME-005', name: 'This Is Fine',     category: 'memes',  emoji: '🔥'               },
  { id: 'ME-006', name: 'Pepe the Frog',    category: 'memes',  emoji: '🐸'               },
  { id: 'ME-007', name: 'Nyan Cat',         category: 'memes',  emoji: '🌈'               },
  { id: 'ME-008', name: 'Crying Jordan',    category: 'memes',  emoji: '😭'               },
  { id: 'ME-009', name: 'Surprised Pikachu',category: 'memes',  emoji: '😮', isNew: true  },
  { id: 'ME-010', name: 'Brain Expanding',  category: 'memes',  emoji: '🧠'               },

  // ── QUOTES ───────────────────────────────────────────────────
  { id: 'QT-001', name: 'Stay Hungry',      category: 'quotes', emoji: '🔥', isNew: true  },
  { id: 'QT-002', name: 'Dream Big',        category: 'quotes', emoji: '🌙'               },
  { id: 'QT-003', name: 'Hustle Hard',      category: 'quotes', emoji: '💪', isNew: true  },
  { id: 'QT-004', name: 'Good Vibes Only',  category: 'quotes', emoji: '☀️'               },
  { id: 'QT-005', name: 'Level Up',         category: 'quotes', emoji: '⬆️', isNew: true  },
  { id: 'QT-006', name: 'Born to Win',      category: 'quotes', emoji: '🏆'               },
  { id: 'QT-007', name: 'Stay Weird',       category: 'quotes', emoji: '🌀'               },
  { id: 'QT-008', name: 'No Pain No Gain',  category: 'quotes', emoji: '⚡'               },
  { id: 'QT-009', name: 'Be Yourself',      category: 'quotes', emoji: '💫', isNew: true  },
  { id: 'QT-010', name: 'Make It Happen',   category: 'quotes', emoji: '✨'               },
  { id: 'QT-011', name: 'Stay Focused',     category: 'quotes', emoji: '🎯'               },
  { id: 'QT-012', name: 'Embrace the Chaos',category: 'quotes', emoji: '🌪️', isNew: true  },

];
