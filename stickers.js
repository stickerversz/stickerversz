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
//  CHANGE THE PRICE (default is 3 MAD):
//    { ..., price: 2 },
//
//  AVAILABLE CATEGORIES:
//    anime · kpop · gaming · sports · movies · music · study · manga · cars · memes · quotes · series · kdrama · others
//
// ================================================================

const STICKERS = [

  // ── ANIME ────────────────────────────────────────────────────
  { id: 'AN-001', name: 'turbo granny',      category: 'anime',  emoji: '🔵', image: 'images/turbo granny.png', isNew: true, price: 3   },
  { id: 'AN-002', name: 'killua', category: 'anime', emoji: '🦊', image: 'images/killua.png', isNew: true, price: 3  },
  { id: 'AN-003', name: 'Monkey D. Luffy',  category: 'anime',  emoji: '🔴' ,image: 'images/monkey d luffy.png', isNew: true, price: 3  },
  { id: 'AN-004', name: 'titan', category: 'anime', emoji: '🦊', image: 'images/titan.png', isNew: true, price: 3   },
  { id: 'AN-005', name: 'my hero academia', category: 'anime', emoji: '🦊', image: 'images/my hero academia.png', isNew: true, price: 3   },
  { id: 'AN-006', name: 'one piece', category: 'anime', emoji: '🦊', image: 'images/one piece.png', isNew: true, price: 3  },
  { id: 'AN-007', name: 'shigaraki', category: 'anime', emoji: '🦊', image: 'images/shigaraki.png', isNew: true, price: 3  },
  { id: 'AN-008', name: 'fire force', category: 'anime', emoji: '🦊', image: 'images/fire force.png', isNew: true, price: 3    },
  { id: 'AN-009', name: 'jjk', category: 'anime', emoji: '🦊', image: 'images/jjk.png', isNew: true, price: 3    },
  { id: 'AN-010', name: 'kaiju no 8', category: 'anime', emoji: '🦊', image: 'images/kaijo no 8.png', isNew: true, price: 3   },
  { id: 'AN-011', name: 'makima', category: 'anime', emoji: '🦊', image: 'images/makima.png',  isNew: true, price: 3 },
  { id: 'AN-012', name: 'all might', category: 'anime', emoji: '🦊', image: 'images/all might.png', isNew: true, price: 3  },
  { id: 'AN-013', name: 'aot', category: 'anime', emoji: '🦊', image: 'images/aot.png', isNew: true, price: 3  },
  { id: 'AN-014', name: 'bakugo', category: 'anime', emoji: '🦊', image: 'images/bakugo.png', isNew: true, price: 3  },
  { id: 'AN-015', name: 'chainsaw man', category: 'anime', emoji: '🦊', image: 'images/chainsaw man.png', isNew: true, price: 3   },
  { id: 'AN-016', name: 'dan da dan', category: 'anime', emoji: '🦊', image: 'images/dan da dan.png', isNew: true, price: 3   },
  { id: 'AN-017', name: 'dr stone', category: 'anime', emoji: '🦊', image: 'images/dr stone.png', isNew: true, price: 3  },

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
  { id: 'MU-001', name: 'AC DC', category: 'music', emoji: '🦊', image: 'images/ac dc.png', isNew: true, price: 3  },
  { id: 'MU-002', name: 'arctic monkeys', category: 'music', emoji: '🦊', image: 'images/arctic monkeys.png', isNew: true, price: 3  },
  { id: 'MU-003', name: 'Black Sabath', category: 'music', emoji: '🦊', image: 'images/black sabath.png', isNew: true, price: 3  },
  { id: 'MU-004', name: 'Doors', category: 'music', emoji: '🦊', image: 'images/doors.png', isNew: true, price: 3  },
  { id: 'MU-005', name: 'Doors', category: 'music', emoji: '🦊', image: 'images/doors1.png', isNew: true, price: 3  },
  { id: 'MU-006', name: 'Eminem', category: 'music', emoji: '🦊', image: 'images/eminem.png', isNew: true, price: 3  },
  { id: 'MU-007', name: 'Gorillaz', category: 'music', emoji: '🦊', image: 'images/gorillaz.png', isNew: true, price: 3  },
  { id: 'MU-008', name: 'Guns n Roses', category: 'music', emoji: '🦊', image: 'images/guns n roses.png', isNew: true, price: 3  },
  { id: 'MU-009', name: 'KISS', category: 'music', emoji: '🦊', image: 'images/kiss.png', isNew: true, price: 3  },
  { id: 'MU-010', name: 'LED ZEPPELIN', category: 'music', emoji: '🦊', image: 'images/led zeppelin.png', isNew: true, price: 3  },
  { id: 'MU-011', name: 'LINKIN PARK', category: 'music', emoji: '🦊', image: 'images/linkin park.png', isNew: true, price: 3  },
  { id: 'MU-012', name: 'MEGADETH', category: 'music', emoji: '🦊', image: 'images/megadeth.png', isNew: true, price: 3  },
  { id: 'MU-013', name: 'NIRVANA', category: 'music', emoji: '🦊', image: 'images/nirvana.png', isNew: true, price: 3  },
  { id: 'MU-014', name: 'OZZY OSBURNE', category: 'music', emoji: '🦊', image: 'images/ozzy osburne.png', isNew: true, price: 3  },
  { id: 'MU-015', name: 'PEARL JAM', category: 'music', emoji: '🦊', image: 'images/pearl jam.png', isNew: true, price: 3  },
  { id: 'MU-016', name: 'PINK FLOYD', category: 'music', emoji: '🦊', image: 'images/pink floyd 1.png', isNew: true, price: 3  },
  { id: 'MU-017', name: 'PINK FLOYD', category: 'music', emoji: '🦊', image: 'images/pink floyd.png', isNew: true, price: 3  },
  { id: 'MU-018', name: 'ROCK AND ROLL', category: 'music', emoji: '🦊', image: 'images/rock and roll.png', isNew: true, price: 3  },
  { id: 'MU-019', name: 'SYSTEM OF A DOWN', category: 'music', emoji: '🦊', image: 'images/system of a down.png', isNew: true, price: 3  },
  // ── STUDY ────────────────────────────────────────────────────
  { id: 'ST-001', name: 'ANNIA DONT WANT TO STUDY', category: 'study', emoji: '🦊', image: 'images/AN001.png', isNew: true, price: 3  },
  { id: 'ST-002', name: 'A VERY TIRED STUDENT', category: 'study', emoji: '🦊', image: 'images/AN002.png', isNew: true, price: 3  },
  { id: 'ST-003', name: 'CAT', category: 'study', emoji: '🦊', image: 'images/AN003.png', isNew: true, price: 3  },
  { id: 'ST-004', name: 'ADORABLE FUNNY', category: 'study', emoji: '🦊', image: 'images/AN004.png', isNew: true, price: 3  },
  { id: 'ST-005', name: 'BAKUGO STUDY', category: 'study', emoji: '🦊', image: 'images/AN005.png', isNew: true, price: 3  },
  { id: 'ST-006', name: 'DAILY MOTIVATION', category: 'study', emoji: '🦊', image: 'images/AN006.png', isNew: true, price: 3  },
  { id: 'ST-007', name: 'GRADUATION HAT', category: 'study', emoji: '🦊', image: 'images/AN007.png', isNew: true, price: 3  },
  { id: 'ST-008', name: 'FOCUS MODE', category: 'study', emoji: '🦊', image: 'images/AN008.png', isNew: true, price: 3  },
  { id: 'ST-009', name: 'FUNNY PANDA', category: 'study', emoji: '🦊', image: 'images/AN009.png', isNew: true, price: 3  },
  { id: 'ST-010', name: 'FUNNY SCIENCE', category: 'study', emoji: '🦊', image: 'images/AN010.png', isNew: true, price: 3  },
  { id: 'ST-011', name: 'BOOKS', category: 'study', emoji: '🦊', image: 'images/AN011.png', isNew: true, price: 3  },
  { id: 'ST-012', name: 'GHOST', category: 'study', emoji: '🦊', image: 'images/AN012.png', isNew: true, price: 3  },
  { id: 'ST-013', name: 'SKELETON ', category: 'study', emoji: '🦊', image: 'images/AN013.png', isNew: true, price: 3  },
  { id: 'ST-014', name: 'TIRED MATH STUDENT', category: 'study', emoji: '🦊', image: 'images/AN014.png', isNew: true, price: 3  },
  { id: 'ST-015', name: 'IM THINKING', category: 'study', emoji: '🦊', image: 'images/AN015.png', isNew: true, price: 3  },
  { id: 'ST-016', name: 'SUCCES', category: 'study', emoji: '🦊', image: 'images/AN016.png', isNew: true, price: 3  },
  { id: 'ST-017', name: 'SPONGE BOB', category: 'study', emoji: '🦊', image: 'images/AN017.png', isNew: true, price: 3  },
  { id: 'ST-018', name: 'ONE MORE CHAPTER', category: 'study', emoji: '🦊', image: 'images/AN018.png', isNew: true, price: 3  },
  { id: 'ST-019', name: 'NOTES', category: 'study', emoji: '🦊', image: 'images/AN019.png', isNew: true, price: 3  },
  { id: 'ST-020', name: 'NEUROSCIENCE', category: 'study', emoji: '🦊', image: 'images/AN020.png', isNew: true, price: 3  },
  { id: 'ST-021', name: 'SAILOR MOON FUNNY', category: 'study', emoji: '🦊', image: 'images/AN021.png', isNew: true, price: 3  },
  { id: 'ST-022', name: 'SNOOPY', category: 'study', emoji: '🦊', image: 'images/AN022.png', isNew: true, price: 3  },
  { id: 'ST-023', name: 'ANNIA FUNNY', category: 'study', emoji: '🦊', image: 'images/AN023.png', isNew: true, price: 3  },
  { id: 'ST-024', name: 'SKELETON HOLDING BOOKS', category: 'study', emoji: '🦊', image: 'images/AN024.png', isNew: true, price: 3  },
  { id: 'ST-025', name: 'BRAIN', category: 'study', emoji: '🦊', image: 'images/AN025.png', isNew: true, price: 3  },
  { id: 'ST-026', name: 'FUNNY DUCK', category: 'study', emoji: '🦊', image: 'images/AN026.png', isNew: true, price: 3  },
  { id: 'ST-027', name: 'STUDY TIME', category: 'study', emoji: '🦊', image: 'images/AN027.png', isNew: true, price: 3  },
  { id: 'ST-028', name: 'HELLO KITTY', category: 'study', emoji: '🦊', image: 'images/AN028.png', isNew: true, price: 3  },
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
  { id: 'QT-028', name: 'FUNNY QUOTE', category: 'quotes', emoji: '🦊', image: 'images/q001.png', isNew: true, price: 3  },
  { id: 'QT-028', name: 'I DONT CARE', category: 'quotes', emoji: '🦊', image: 'images/q002.png', isNew: true, price: 3  },

  // ── SERIES ───────────────────────────────────────────────────
  { id: 'SR-001', name: 'Breaking Bad',      category: 'series', emoji: '⚗️', isNew: true  },
  { id: 'SR-002', name: 'Game of Thrones',   category: 'series', emoji: '🐉', isNew: true  },
  { id: 'SR-003', name: 'Stranger Things',   category: 'series', emoji: '🔦', isNew: true  },
  { id: 'SR-004', name: 'The Office',        category: 'series', emoji: '📎'               },
  { id: 'SR-005', name: 'Friends',           category: 'series', emoji: '☕'               },
  { id: 'SR-006', name: 'Squid Game',        category: 'series', emoji: '🟩', isNew: true  },
  { id: 'SR-007', name: 'Peaky Blinders',    category: 'series', emoji: '🎩'               },
  { id: 'SR-008', name: 'The Last of Us',    category: 'series', emoji: '🍄', isNew: true  },
  { id: 'SR-009', name: 'Wednesday',         category: 'series', emoji: '🖤', isNew: true  },
  { id: 'SR-010', name: 'Dark',              category: 'series', emoji: '🕳️'               },
  { id: 'SR-011', name: 'The Bear',          category: 'series', emoji: '🐻', isNew: true  },
  { id: 'SR-012', name: 'House of the Dragon', category: 'series', emoji: '🔥', isNew: true },

  // ── K-DRAMA ──────────────────────────────────────────────────
  { id: 'KD-001', name: 'Crash Landing on You', category: 'kdrama', emoji: '🪂', isNew: true },
  { id: 'KD-002', name: 'Goblin',            category: 'kdrama', emoji: '🕯️', isNew: true  },
  { id: 'KD-003', name: 'Itaewon Class',     category: 'kdrama', emoji: '🍺'               },
  { id: 'KD-004', name: 'Vincenzo',          category: 'kdrama', emoji: '🌹', isNew: true  },
  { id: 'KD-005', name: 'The Glory',         category: 'kdrama', emoji: '✨', isNew: true  },
  { id: 'KD-006', name: 'Business Proposal', category: 'kdrama', emoji: '💼'               },
  { id: 'KD-007', name: 'Twenty Five Twenty One', category: 'kdrama', emoji: '🤸'          },
  { id: 'KD-008', name: 'My Love From the Star', category: 'kdrama', emoji: '⭐', isNew: true },
  { id: 'KD-009', name: 'Strong Woman Do Bong-soon', category: 'kdrama', emoji: '💪'       },
  { id: 'KD-010', name: 'Extraordinary Woo', category: 'kdrama', emoji: '🐳', isNew: true  },

  // ── OTHERS ───────────────────────────────────────────────────
  { id: 'OT-001', name: 'Question Mark',     category: 'others', emoji: '❓'               },
  { id: 'OT-002', name: 'Lucky Star',        category: 'others', emoji: '🌟', isNew: true  },
  { id: 'OT-003', name: 'Rainbow',           category: 'others', emoji: '🌈'               },
  { id: 'OT-004', name: 'Mystery Box',       category: 'others', emoji: '📦', isNew: true  },
  { id: 'OT-005', name: 'Planet',            category: 'others', emoji: '🪐'               },
  { id: 'OT-006', name: 'Crystal Ball',      category: 'others', emoji: '🔮', isNew: true  },
  { id: 'OT-007', name: 'Infinity',          category: 'others', emoji: '♾️'               },
  { id: 'OT-008', name: 'Custom Design',     category: 'others', emoji: '🎨', isNew: true  },

];
