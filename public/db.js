'use strict';
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'stickerversz.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function setup() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sticker_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      price REAL DEFAULT 3,
      currency TEXT DEFAULT 'MAD',
      description TEXT DEFAULT '',
      emoji TEXT DEFAULT '✨',
      image TEXT,
      stock INTEGER DEFAULT 100,
      status TEXT DEFAULT 'in_stock',
      low_stock_threshold INTEGER DEFAULT 5,
      is_new INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      waterproof INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_notes TEXT DEFAULT '',
      subtotal REAL NOT NULL,
      delivery_fee REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'cod',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      sticker_id TEXT NOT NULL,
      name TEXT NOT NULL,
      image TEXT DEFAULT '',
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS delivery_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      price REAL NOT NULL,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT DEFAULT '',
      type TEXT DEFAULT 'text',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  if (catCount === 0) {
    const cats = [
      { slug: 'anime',   name: 'Anime',    icon: 'anime.svg',   sort_order: 1 },
      { slug: 'kpop',    name: 'K-Pop',    icon: 'kpop.svg',    sort_order: 2 },
      { slug: 'gaming',  name: 'Gaming',   icon: 'gaming.svg',  sort_order: 3 },
      { slug: 'sports',  name: 'Sports',   icon: 'sports.svg',  sort_order: 4 },
      { slug: 'movies',  name: 'Movies',   icon: 'movies.svg',  sort_order: 5 },
      { slug: 'music',   name: 'Music',    icon: 'music.svg',   sort_order: 6 },
      { slug: 'study',   name: 'Study',    icon: 'study.svg',   sort_order: 7 },
      { slug: 'manga',   name: 'Manga',    icon: 'manga.svg',   sort_order: 8 },
      { slug: 'cars',    name: 'Cars',     icon: 'cars.svg',    sort_order: 9 },
      { slug: 'memes',   name: 'Memes',    icon: 'memes.svg',   sort_order: 10 },
      { slug: 'quotes',  name: 'Quotes',   icon: 'quotes.svg',  sort_order: 11 },
      { slug: 'series',  name: 'Series',   icon: 'series.svg',  sort_order: 12 },
      { slug: 'kdrama',  name: 'K-Drama',  icon: 'kdrama.svg',  sort_order: 13 },
      { slug: 'cartoon', name: 'Cartoon',  icon: 'cartoon.svg', sort_order: 14 },
      { slug: 'others',  name: 'Others',   icon: 'others.svg',  sort_order: 15 },
    ];
    const insertCat = db.prepare('INSERT INTO categories (slug, name, icon, sort_order) VALUES (@slug, @name, @icon, @sort_order)');
    for (const cat of cats) insertCat.run(cat);
    console.log('✓ Categories seeded');
  }

  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (prodCount === 0) {
    seedProducts();
    console.log('✓ Products seeded');
  }

  const delCount = db.prepare('SELECT COUNT(*) as c FROM delivery_zones').get().c;
  if (delCount === 0) {
    const zones = [
      { city: 'Casablanca',    price: 25, is_default: 0 },
      { city: 'Rabat',         price: 30, is_default: 0 },
      { city: 'Marrakech',     price: 35, is_default: 0 },
      { city: 'Fès',           price: 35, is_default: 0 },
      { city: 'Tanger',        price: 35, is_default: 0 },
      { city: 'Agadir',        price: 40, is_default: 0 },
      { city: 'Meknès',        price: 35, is_default: 0 },
      { city: 'Oujda',         price: 40, is_default: 0 },
      { city: 'Autres villes', price: 40, is_default: 1 },
    ];
    const insertZone = db.prepare('INSERT INTO delivery_zones (city, price, is_default) VALUES (@city, @price, @is_default)');
    for (const z of zones) insertZone.run(z);
    console.log('✓ Delivery zones seeded');
  }

  const contentCount = db.prepare('SELECT COUNT(*) as c FROM site_content').get().c;
  if (contentCount === 0) {
    const content = [
      { key: 'hero_title',       value: 'STICK YOUR STYLE.',              type: 'text' },
      { key: 'hero_subtitle',    value: 'premium waterproof stickers for every vibe 💜\nanime · gaming · k-pop · music · sports · memes & more', type: 'text' },
      { key: 'hero_cta_primary', value: 'SHOP STICKERS',                  type: 'text' },
      { key: 'hero_cta_free',    value: '🎁 GET FREE STICKERS',           type: 'text' },
      { key: 'instagram_handle', value: 'stickerversz',                   type: 'text' },
      { key: 'contact_email',    value: 'stickerversz@gmail.com',         type: 'text' },
      { key: 'contact_location', value: 'Morocco 🇲🇦',                    type: 'text' },
      { key: 'about_text',       value: 'StickerVersz is a premium waterproof sticker brand based in Morocco. We create high-quality stickers for every passion — anime, gaming, K-pop, music, sports, and more.', type: 'text' },
      { key: 'promo_title',      value: 'Order More, Score Free!',        type: 'text' },
      { key: 'promo_subtitle',   value: 'pick any stickers you want from our full catalog — zero catch, pure love 💛', type: 'text' },
      { key: 'stat_designs',     value: '80',                             type: 'text' },
      { key: 'stat_categories',  value: '15',                             type: 'text' },
    ];
    const insertContent = db.prepare('INSERT INTO site_content (key, value, type) VALUES (@key, @value, @type)');
    for (const c of content) insertContent.run(c);
    console.log('✓ Site content seeded');
  }

  const faqCount = db.prepare('SELECT COUNT(*) as c FROM faqs').get().c;
  if (faqCount === 0) {
    const faqs = [
      { question: 'Are the stickers waterproof?', answer: 'Yes! All our stickers are 100% waterproof. They can withstand water, sun, and everyday wear.', sort_order: 1 },
      { question: 'How do I order?', answer: 'Browse our collection, copy the sticker IDs you want, then send us a DM on Instagram @stickerversz with your list.', sort_order: 2 },
      { question: 'How much does delivery cost?', answer: 'Delivery prices vary by city. Casablanca: 25 MAD, major cities: 30–35 MAD, other cities: 40 MAD.', sort_order: 3 },
      { question: 'How long does delivery take?', answer: 'Usually 2–5 business days depending on your location in Morocco.', sort_order: 4 },
      { question: 'What payment methods do you accept?', answer: 'We accept Cash on Delivery (COD) — you pay when you receive your order.', sort_order: 5 },
    ];
    const insertFaq = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (@question, @answer, @sort_order)');
    for (const f of faqs) insertFaq.run(f);
    console.log('✓ FAQs seeded');
  }

  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admin_users').get().c;
  if (adminCount === 0) {
    const password = process.env.ADMIN_PASSWORD || 'stickerversz2024';
    const hash = bcrypt.hashSync(password, 12);
    const username = process.env.ADMIN_USERNAME || 'admin';
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
    console.log(`✓ Admin user created: ${username}`);
  }
}

function seedProducts() {
  const insert = db.prepare(`
    INSERT INTO products (sticker_id, name, category_slug, price, currency, emoji, image, stock, status, is_new)
    VALUES (@sticker_id, @name, @category_slug, @price, @currency, @emoji, @image, @stock, @status, @is_new)
  `);

  const STICKERS = [
    { id:'AN-001', name:'turbo granny',           category:'anime',  emoji:'🔵', image:'images/turbo granny.png' },
    { id:'AN-002', name:'killua',                 category:'anime',  emoji:'🦊', image:'images/killua.png' },
    { id:'AN-003', name:'Monkey D. Luffy',        category:'anime',  emoji:'🔴', image:'images/monkey d luffy.png' },
    { id:'AN-004', name:'titan',                  category:'anime',  emoji:'🦊', image:'images/titan.png' },
    { id:'AN-005', name:'my hero academia',       category:'anime',  emoji:'🦊', image:'images/my hero academia.png' },
    { id:'AN-006', name:'one piece',              category:'anime',  emoji:'🦊', image:'images/one piece.png' },
    { id:'AN-007', name:'shigaraki',              category:'anime',  emoji:'🦊', image:'images/shigaraki.png' },
    { id:'AN-008', name:'fire force',             category:'anime',  emoji:'🦊', image:'images/fire force.png' },
    { id:'AN-009', name:'jjk',                    category:'anime',  emoji:'🦊', image:'images/jjk.png' },
    { id:'AN-010', name:'kaiju no 8',             category:'anime',  emoji:'🦊', image:'images/kaijo no 8.png' },
    { id:'AN-011', name:'makima',                 category:'anime',  emoji:'🦊', image:'images/makima.png' },
    { id:'AN-012', name:'all might',              category:'anime',  emoji:'🦊', image:'images/all might.png' },
    { id:'AN-013', name:'aot',                    category:'anime',  emoji:'🦊', image:'images/aot.png' },
    { id:'AN-014', name:'bakugo',                 category:'anime',  emoji:'🦊', image:'images/bakugo.png' },
    { id:'AN-015', name:'chainsaw man',           category:'anime',  emoji:'🦊', image:'images/chainsaw man.png' },
    { id:'AN-016', name:'dan da dan',             category:'anime',  emoji:'🦊', image:'images/dan da dan.png' },
    { id:'AN-017', name:'dr stone',               category:'anime',  emoji:'🦊', image:'images/dr stone.png' },
    { id:'KP-001', name:'BTS',                    category:'kpop',   emoji:'🦊', image:'images/kp001.png' },
    { id:'KP-002', name:'STRAY KIDS',             category:'kpop',   emoji:'🦊', image:'images/kp002.png' },
    { id:'KP-003', name:'HAN JISUNG',             category:'kpop',   emoji:'🦊', image:'images/kp003.png' },
    { id:'KP-004', name:'BTS',                    category:'kpop',   emoji:'🦊', image:'images/kp006.png' },
    { id:'KP-005', name:'BTS',                    category:'kpop',   emoji:'🦊', image:'images/kp007.png' },
    { id:'KP-006', name:'baby monster',           category:'kpop',   emoji:'🦊', image:'images/kp008.png' },
    { id:'KP-007', name:'K-Pop Sticker 7',        category:'kpop',   emoji:'🦊', image:'images/kp009.png' },
    { id:'KP-008', name:'K-Pop Sticker 8',        category:'kpop',   emoji:'🦊', image:'images/kp010.png' },
    { id:'KP-009', name:'K-Pop Sticker 9',        category:'kpop',   emoji:'🦊', image:'images/kp011.png' },
    { id:'KP-010', name:'K-Pop Sticker 10',       category:'kpop',   emoji:'🦊', image:'images/kp012.png' },
    { id:'GA-001', name:'MARIO PLANT',            category:'gaming', emoji:'🦊', image:'images/g002.png' },
    { id:'GA-002', name:'GAMERS DONT DIE',        category:'gaming', emoji:'🦊', image:'images/g003.png' },
    { id:'GA-003', name:'MUSHROOM',               category:'gaming', emoji:'🦊', image:'images/g004.png' },
    { id:'GA-004', name:'PAC MAN',                category:'gaming', emoji:'🦊', image:'images/g005.png' },
    { id:'GA-005', name:'ZOMBIE',                 category:'gaming', emoji:'🦊', image:'images/g006.png' },
    { id:'GA-006', name:'CONTROLLER BUTTONS',     category:'gaming', emoji:'🦊', image:'images/g007.png' },
    { id:'GA-007', name:'YOSHI',                  category:'gaming', emoji:'🦊', image:'images/g008.png' },
    { id:'GA-008', name:'GAME MODE ON',           category:'gaming', emoji:'🦊', image:'images/g009.png' },
    { id:'GA-009', name:'PLAY STATION',           category:'gaming', emoji:'🦊', image:'images/g010.png' },
    { id:'GA-010', name:'HEARTS',                 category:'gaming', emoji:'🦊', image:'images/g011.png' },
    { id:'GA-011', name:'SEGA',                   category:'gaming', emoji:'🦊', image:'images/g012.png' },
    { id:'GA-012', name:'MARIO STAR',             category:'gaming', emoji:'🦊', image:'images/g013.png' },
    { id:'GA-013', name:'STREET FIGHTER',         category:'gaming', emoji:'🦊', image:'images/g014.png' },
    { id:'GA-014', name:'HOLLOW KNIGHT',          category:'gaming', emoji:'🦊', image:'images/g015.png' },
    { id:'GA-015', name:'CRASH',                  category:'gaming', emoji:'🦊', image:'images/g016.png' },
    { id:'GA-016', name:'GB CONTROLLER',          category:'gaming', emoji:'🦊', image:'images/g017.png' },
    { id:'SP-001', name:'FC BARCELONA',           category:'sports', emoji:'🦊', image:'images/sp001.png' },
    { id:'SP-002', name:'RAJA',                   category:'sports', emoji:'🦊', image:'images/sp002.png' },
    { id:'SP-003', name:'EAGLES',                 category:'sports', emoji:'🦊', image:'images/sp003.png' },
    { id:'SP-004', name:'WIDAD',                  category:'sports', emoji:'🦊', image:'images/sp004.png' },
    { id:'SP-005', name:'WINS05',                 category:'sports', emoji:'🦊', image:'images/sp005.png' },
    { id:'SP-006', name:'WDC TROPHY',             category:'sports', emoji:'🦊', image:'images/sp006.png' },
    { id:'SP-007', name:'REAL MADRID',            category:'sports', emoji:'🦊', image:'images/sp007.png' },
    { id:'SP-008', name:'MANCHESTER UNITED',      category:'sports', emoji:'🦊', image:'images/sp008.png' },
    { id:'SP-009', name:'MANCHESTER CITY',        category:'sports', emoji:'🦊', image:'images/sp009.png' },
    { id:'SP-010', name:'EAGLES',                 category:'sports', emoji:'🦊', image:'images/sp010.png' },
    { id:'MV-001', name:'SPIDER MAN',             category:'movies', emoji:'🦊', image:'images/mo001.png' },
    { id:'MV-002', name:'SPIDER MAN 2',           category:'movies', emoji:'🦊', image:'images/mo002.png' },
    { id:'MV-003', name:'SPIDER MAN 3',           category:'movies', emoji:'🦊', image:'images/mo003.png' },
    { id:'MV-004', name:'TAXI DRIVER',            category:'movies', emoji:'🦊', image:'images/mo004.png' },
    { id:'MV-005', name:'MEAN GIRLS',             category:'movies', emoji:'🦊', image:'images/mo005.png' },
    { id:'MV-006', name:'SUPERBAD',               category:'movies', emoji:'🦊', image:'images/mo006.png' },
    { id:'MV-007', name:'THE MASK MAGNET',        category:'movies', emoji:'🦊', image:'images/mo007.png' },
    { id:'MV-008', name:'SCARFACE',               category:'movies', emoji:'🦊', image:'images/mo008.png' },
    { id:'MV-009', name:'SPIDER MAN VERSE',       category:'movies', emoji:'🦊', image:'images/mo009.png' },
    { id:'MV-010', name:'FIGHT CLUB',             category:'movies', emoji:'🦊', image:'images/mo010.png' },
    { id:'MV-011', name:'GOOD FELLAS',            category:'movies', emoji:'🦊', image:'images/mo011.png' },
    { id:'MV-012', name:'THE HANGOVER',           category:'movies', emoji:'🦊', image:'images/mo012.png' },
    { id:'MU-001', name:'AC DC',                  category:'music',  emoji:'🦊', image:'images/ac dc.png' },
    { id:'MU-002', name:'arctic monkeys',         category:'music',  emoji:'🦊', image:'images/arctic monkeys.png' },
    { id:'MU-003', name:'Black Sabbath',          category:'music',  emoji:'🦊', image:'images/black sabath.png' },
    { id:'MU-004', name:'Doors',                  category:'music',  emoji:'🦊', image:'images/doors.png' },
    { id:'MU-005', name:'Doors 2',                category:'music',  emoji:'🦊', image:'images/doors1.png' },
    { id:'MU-006', name:'Eminem',                 category:'music',  emoji:'🦊', image:'images/eminem.png' },
    { id:'MU-007', name:'Gorillaz',               category:'music',  emoji:'🦊', image:'images/gorillaz.png' },
    { id:'MU-008', name:'Guns n Roses',           category:'music',  emoji:'🦊', image:'images/guns n roses.png' },
    { id:'MU-009', name:'KISS',                   category:'music',  emoji:'🦊', image:'images/kiss.png' },
    { id:'MU-010', name:'LED ZEPPELIN',           category:'music',  emoji:'🦊', image:'images/led zeppelin.png' },
    { id:'MU-011', name:'LINKIN PARK',            category:'music',  emoji:'🦊', image:'images/linkin park.png' },
    { id:'MU-012', name:'MEGADETH',               category:'music',  emoji:'🦊', image:'images/megadeth.png' },
    { id:'MU-013', name:'NIRVANA',                category:'music',  emoji:'🦊', image:'images/nirvana.png' },
    { id:'MU-014', name:'OZZY OSBOURNE',          category:'music',  emoji:'🦊', image:'images/ozzy osburne.png' },
    { id:'MU-015', name:'PEARL JAM',              category:'music',  emoji:'🦊', image:'images/pearl jam.png' },
    { id:'MU-016', name:'PINK FLOYD 1',           category:'music',  emoji:'🦊', image:'images/pink floyd 1.png' },
    { id:'MU-017', name:'PINK FLOYD',             category:'music',  emoji:'🦊', image:'images/pink floyd.png' },
    { id:'MU-018', name:'ROCK AND ROLL',          category:'music',  emoji:'🦊', image:'images/rock and roll.png' },
    { id:'MU-019', name:'DUA LIPA WDC26',         category:'music',  emoji:'🦊', image:'images/mu001.png' },
    { id:'MU-020', name:'THE ROLLING STONES',     category:'music',  emoji:'🦊', image:'images/mu002.png' },
    { id:'MU-021', name:'MICHAEL JACKSON',        category:'music',  emoji:'🦊', image:'images/mu003.png' },
    { id:'MU-022', name:'MADONNA',                category:'music',  emoji:'🦊', image:'images/mu004.png' },
    { id:'MU-023', name:'MAYHEM LADY GAGA',       category:'music',  emoji:'🦊', image:'images/mu005.png' },
    { id:'MU-024', name:'I LOVE LADY GAGA',       category:'music',  emoji:'🦊', image:'images/mu006.png' },
    { id:'MU-025', name:'DUA LIPA',               category:'music',  emoji:'🦊', image:'images/mu007.png' },
    { id:'MU-026', name:'TAYLOR SWIFT',           category:'music',  emoji:'🦊', image:'images/mu008.png' },
    { id:'ST-001', name:'ANNIA DONT WANT TO STUDY', category:'study', emoji:'🦊', image:'images/AN001.png' },
    { id:'ST-002', name:'A VERY TIRED STUDENT',   category:'study',  emoji:'🦊', image:'images/AN002.png' },
    { id:'ST-003', name:'CAT',                    category:'study',  emoji:'🦊', image:'images/AN003.png' },
    { id:'ST-004', name:'ADORABLE FUNNY',         category:'study',  emoji:'🦊', image:'images/AN004.png' },
    { id:'ST-005', name:'BAKUGO STUDY',           category:'study',  emoji:'🦊', image:'images/AN005.png' },
    { id:'ST-006', name:'DAILY MOTIVATION',       category:'study',  emoji:'🦊', image:'images/AN006.png' },
    { id:'ST-007', name:'GRADUATION HAT',         category:'study',  emoji:'🦊', image:'images/AN007.png' },
    { id:'ST-008', name:'FOCUS MODE',             category:'study',  emoji:'🦊', image:'images/AN008.png' },
    { id:'ST-009', name:'FUNNY PANDA',            category:'study',  emoji:'🦊', image:'images/AN009.png' },
    { id:'ST-010', name:'FUNNY SCIENCE',          category:'study',  emoji:'🦊', image:'images/AN010.png' },
    { id:'ST-011', name:'BOOKS',                  category:'study',  emoji:'🦊', image:'images/AN011.png' },
    { id:'ST-012', name:'GHOST',                  category:'study',  emoji:'🦊', image:'images/AN012.png' },
    { id:'ST-013', name:'SKELETON',               category:'study',  emoji:'🦊', image:'images/AN013.png' },
    { id:'ST-014', name:'TIRED MATH STUDENT',     category:'study',  emoji:'🦊', image:'images/AN014.png' },
    { id:'ST-015', name:'IM THINKING',            category:'study',  emoji:'🦊', image:'images/AN015.png' },
    { id:'ST-016', name:'SUCCESS',                category:'study',  emoji:'🦊', image:'images/AN016.png' },
    { id:'ST-017', name:'SPONGE BOB',             category:'study',  emoji:'🦊', image:'images/AN017.png' },
    { id:'ST-018', name:'ONE MORE CHAPTER',       category:'study',  emoji:'🦊', image:'images/AN018.png' },
    { id:'ST-019', name:'NOTES',                  category:'study',  emoji:'🦊', image:'images/AN019.png' },
    { id:'ST-020', name:'NEUROSCIENCE',           category:'study',  emoji:'🦊', image:'images/AN020.png' },
    { id:'ST-021', name:'SAILOR MOON FUNNY',      category:'study',  emoji:'🦊', image:'images/AN021.png' },
    { id:'ST-022', name:'SNOOPY',                 category:'study',  emoji:'🦊', image:'images/AN022.png' },
    { id:'ST-023', name:'ANNIA FUNNY',            category:'study',  emoji:'🦊', image:'images/AN023.png' },
    { id:'ST-024', name:'SKELETON HOLDING BOOKS', category:'study',  emoji:'🦊', image:'images/AN024.png' },
    { id:'ST-025', name:'BRAIN',                  category:'study',  emoji:'🦊', image:'images/AN025.png' },
    { id:'ST-026', name:'FUNNY DUCK',             category:'study',  emoji:'🦊', image:'images/AN026.png' },
    { id:'ST-027', name:'STUDY TIME',             category:'study',  emoji:'🦊', image:'images/AN027.png' },
    { id:'ST-028', name:'HELLO KITTY',            category:'study',  emoji:'🦊', image:'images/AN028.png' },
    { id:'MG-001', name:'Manga Sticker 1',        category:'manga',  emoji:'🦊', image:'images/ma001.png' },
    { id:'MG-002', name:'Manga Sticker 2',        category:'manga',  emoji:'🦊', image:'images/ma002.png' },
    { id:'MG-003', name:'Manga Sticker 3',        category:'manga',  emoji:'🦊', image:'images/ma003.png' },
    { id:'MG-004', name:'Manga Sticker 4',        category:'manga',  emoji:'🦊', image:'images/ma004.png' },
    { id:'MG-005', name:'Manga Sticker 5',        category:'manga',  emoji:'🦊', image:'images/ma005.png' },
    { id:'MG-006', name:'Manga Sticker 6',        category:'manga',  emoji:'🦊', image:'images/ma006.png' },
    { id:'MG-007', name:'Manga Sticker 7',        category:'manga',  emoji:'🦊', image:'images/ma007.png' },
    { id:'MG-008', name:'Manga Sticker 8',        category:'manga',  emoji:'🦊', image:'images/ma008.png' },
    { id:'MG-009', name:'Manga Sticker 9',        category:'manga',  emoji:'🦊', image:'images/ma009.png' },
    { id:'MG-010', name:'Manga Sticker 10',       category:'manga',  emoji:'🦊', image:'images/ma010.png' },
    { id:'CR-001', name:'BMW M',                  category:'cars',   emoji:'🦊', image:'images/c001.png' },
    { id:'CR-002', name:'LECLERC FERRARI RADIO',  category:'cars',   emoji:'🦊', image:'images/c002.png' },
    { id:'CR-003', name:'FLAGS',                  category:'cars',   emoji:'🦊', image:'images/c003.png' },
    { id:'CR-004', name:'BOX BOX',                category:'cars',   emoji:'🦊', image:'images/c004.png' },
    { id:'CR-005', name:'FERRARI',                category:'cars',   emoji:'🦊', image:'images/c005.png' },
    { id:'CR-006', name:'MERCEDES BENZ',          category:'cars',   emoji:'🦊', image:'images/c006.png' },
    { id:'CR-007', name:'MUSTANG',                category:'cars',   emoji:'🦊', image:'images/c007.png' },
    { id:'CR-008', name:'RS',                     category:'cars',   emoji:'🦊', image:'images/c008.png' },
    { id:'CR-009', name:'F1 FERRARI CAR',         category:'cars',   emoji:'🦊', image:'images/c009.png' },
    { id:'CR-010', name:'AMG',                    category:'cars',   emoji:'🦊', image:'images/c010.png' },
    { id:'ME-001', name:'Meme Sticker 1',         category:'memes',  emoji:'🦊', image:'images/me001.png' },
    { id:'ME-002', name:'Meme Sticker 2',         category:'memes',  emoji:'🦊', image:'images/me002.png' },
    { id:'ME-003', name:'Meme Sticker 3',         category:'memes',  emoji:'🦊', image:'images/me003.png' },
    { id:'ME-004', name:'Meme Sticker 4',         category:'memes',  emoji:'🦊', image:'images/me004.png' },
    { id:'ME-005', name:'Meme Sticker 5',         category:'memes',  emoji:'🦊', image:'images/me005.png' },
    { id:'ME-006', name:'Meme Sticker 6',         category:'memes',  emoji:'🦊', image:'images/me006.png' },
    { id:'ME-007', name:'Meme Sticker 7',         category:'memes',  emoji:'🦊', image:'images/me007.png' },
    { id:'ME-008', name:'Meme Sticker 8',         category:'memes',  emoji:'🦊', image:'images/me008.png' },
    { id:'ME-009', name:'Meme Sticker 9',         category:'memes',  emoji:'🦊', image:'images/me009.png' },
    { id:'ME-010', name:'Meme Sticker 10',        category:'memes',  emoji:'🦊', image:'images/me010.png' },
    { id:'QT-001', name:'FUNNY QUOTE',                    category:'quotes', emoji:'🦊', image:'images/q001.png' },
    { id:'QT-002', name:'I DONT CARE',                    category:'quotes', emoji:'🦊', image:'images/q002.png' },
    { id:'QT-003', name:'NO RISK NO FUN',                 category:'quotes', emoji:'🦊', image:'images/q003.png' },
    { id:'QT-004', name:'365 DAYS 365 WAYS',              category:'quotes', emoji:'🦊', image:'images/q004.png' },
    { id:'QT-005', name:'SUPPORTIV',                      category:'quotes', emoji:'🦊', image:'images/q005.png' },
    { id:'QT-006', name:'DONT LET IDIOTS RUIN YOUR DAY',  category:'quotes', emoji:'🦊', image:'images/q006.png' },
    { id:'QT-007', name:'NEVER BACK DOWN',                category:'quotes', emoji:'🦊', image:'images/q007.png' },
    { id:'QT-008', name:'ITS JUST A BAD DAY',             category:'quotes', emoji:'🦊', image:'images/q008.png' },
    { id:'QT-009', name:'WHATEVER IT TAKES',              category:'quotes', emoji:'🦊', image:'images/q009.png' },
    { id:'QT-010', name:'YOU ARE SO HONEY',               category:'quotes', emoji:'🦊', image:'images/q010.png' },
    { id:'SR-001', name:'STRANGER THINGS',        category:'series', emoji:'🦊', image:'images/se001.png' },
    { id:'SR-002', name:'WEDNESDAY',              category:'series', emoji:'🦊', image:'images/se002.png' },
    { id:'SR-003', name:'PEAKY BLINDERS',         category:'series', emoji:'🦊', image:'images/se003.png' },
    { id:'SR-004', name:'THE WALKING DEAD',       category:'series', emoji:'🦊', image:'images/se004.png' },
    { id:'SR-005', name:'SQUID GAME',             category:'series', emoji:'🦊', image:'images/se005.png' },
    { id:'SR-006', name:'BELLA CIAO',             category:'series', emoji:'🦊', image:'images/se006.png' },
    { id:'SR-007', name:'GAME OF THRONES',        category:'series', emoji:'🦊', image:'images/se007.png' },
    { id:'SR-008', name:'HOUSE OF THE DRAGON',    category:'series', emoji:'🦊', image:'images/se008.png' },
    { id:'SR-009', name:'BETTER CALL SAUL',       category:'series', emoji:'🦊', image:'images/se009.png' },
    { id:'SR-010', name:'BREAKING BAD',           category:'series', emoji:'🦊', image:'images/se010.png' },
    { id:'SR-011', name:'THE LAST OF US',         category:'series', emoji:'🦊', image:'images/se011.png' },
    { id:'KD-001', name:'WELCOME TO WAIKIKI',     category:'kdrama', emoji:'🦊', image:'images/kd001.png' },
    { id:'KD-002', name:'BUSINESS PROPOSAL',      category:'kdrama', emoji:'🦊', image:'images/kd002.png' },
    { id:'KD-003', name:'LOVELY RUNNER',          category:'kdrama', emoji:'🦊', image:'images/kd003.png' },
    { id:'KD-004', name:'DRAMA QUEEN',            category:'kdrama', emoji:'🦊', image:'images/kd004.png' },
    { id:'KD-005', name:'WEAK HERO',              category:'kdrama', emoji:'🦊', image:'images/kd005.png' },
    { id:'KD-006', name:'ALL OF US ARE DEAD',     category:'kdrama', emoji:'🦊', image:'images/kd006.png' },
    { id:'KD-007', name:'WAR IN LIFE',            category:'kdrama', emoji:'🦊', image:'images/kd007.png' },
    { id:'KD-008', name:'TRUE BEAUTY',            category:'kdrama', emoji:'🦊', image:'images/kd008.png' },
    { id:'KD-009', name:'VINCENZO',               category:'kdrama', emoji:'🦊', image:'images/kd009.png' },
    { id:'KD-010', name:'MY DEMON',               category:'kdrama', emoji:'🦊', image:'images/kd010.png' },
    { id:'CT-001', name:'GUMBALL',                category:'cartoon', emoji:'🦊', image:'images/ca001.png' },
    { id:'CT-002', name:'BIMO',                   category:'cartoon', emoji:'🦊', image:'images/ca002.png' },
    { id:'CT-003', name:'MCQUEEN',                category:'cartoon', emoji:'🦊', image:'images/ca003.png' },
    { id:'CT-004', name:'GENGAR',                 category:'cartoon', emoji:'🦊', image:'images/ca004.png' },
    { id:'CT-005', name:'JOHNY',                  category:'cartoon', emoji:'🦊', image:'images/ca005.png' },
    { id:'CT-006', name:'LEMONGRAB',              category:'cartoon', emoji:'🦊', image:'images/ca006.png' },
    { id:'CT-007', name:'GUMBALL 2',              category:'cartoon', emoji:'🦊', image:'images/ca007.png' },
    { id:'CT-008', name:'SPONGEBOOB AND PATRICK', category:'cartoon', emoji:'🦊', image:'images/ca008.png' },
    { id:'CT-009', name:'PINK PANTHER',           category:'cartoon', emoji:'🦊', image:'images/ca009.png' },
    { id:'CT-010', name:'MUSCLE MAN',             category:'cartoon', emoji:'🦊', image:'images/ca010.png' },
    { id:'CT-011', name:'RICK',                   category:'cartoon', emoji:'🦊', image:'images/ca011.png' },
    { id:'CT-012', name:'POWERPUFF GIRLS',        category:'cartoon', emoji:'🦊', image:'images/ca012.png' },
    { id:'CT-013', name:'JAKE',                   category:'cartoon', emoji:'🦊', image:'images/ca013.png' },
    { id:'CT-014', name:'TEEN TITANS GO',         category:'cartoon', emoji:'🦊', image:'images/ca014.png' },
    { id:'CT-015', name:'FINN AND JAKE AND BIMO', category:'cartoon', emoji:'🦊', image:'images/ca015.png' },
    { id:'CT-016', name:'SPONGE BOB',             category:'cartoon', emoji:'🦊', image:'images/ca016.png' },
    { id:'CT-017', name:'GRAVITY FALLS',          category:'cartoon', emoji:'🦊', image:'images/ca017.png' },
    { id:'CT-018', name:'SUMOZSKI',               category:'cartoon', emoji:'🦊', image:'images/ca018.png' },
    { id:'CT-019', name:'PLANKTON',               category:'cartoon', emoji:'🦊', image:'images/ca019.png' },
    { id:'CT-020', name:'PIZZA RICK',             category:'cartoon', emoji:'🦊', image:'images/ca020.png' },
    { id:'CT-021', name:'SNORLAX',                category:'cartoon', emoji:'🦊', image:'images/ca021.png' },
    { id:'CT-022', name:'REGULAR SHOW',           category:'cartoon', emoji:'🦊', image:'images/ca022.png' },
    { id:'CT-023', name:'PICKLE RICK',            category:'cartoon', emoji:'🦊', image:'images/ca023.png' },
    { id:'OT-001', name:'CAT',                    category:'others', emoji:'🦊', image:'images/ot001.png' },
    { id:'OT-002', name:'DORITOS',                category:'others', emoji:'🦊', image:'images/ot002.png' },
    { id:'OT-003', name:'MADE IN JAPAN',          category:'others', emoji:'🦊', image:'images/ot003.png' },
    { id:'OT-004', name:'OVERTHINKERS CLUB',      category:'others', emoji:'🦊', image:'images/ot004.png' },
    { id:'OT-005', name:'CUTE',                   category:'others', emoji:'🦊', image:'images/ot005.png' },
    { id:'OT-006', name:'LIME',                   category:'others', emoji:'🦊', image:'images/ot006.png' },
    { id:'OT-007', name:'FLOWER',                 category:'others', emoji:'🦊', image:'images/ot007.png' },
    { id:'OT-008', name:'PRINGLES',               category:'others', emoji:'🦊', image:'images/ot008.png' },
    { id:'OT-009', name:'SANTA CRUZ',             category:'others', emoji:'🦊', image:'images/ot009.png' },
    { id:'OT-010', name:'MONSTER',                category:'others', emoji:'🦊', image:'images/ot010.png' },
    { id:'OT-011', name:'COCA COLA',              category:'others', emoji:'🦊', image:'images/ot011.png' },
    { id:'OT-012', name:'CUTE FIRE',              category:'others', emoji:'🦊', image:'images/ot012.png' },
    { id:'OT-013', name:'WARNING',                category:'others', emoji:'🦊', image:'images/ot013.png' },
    { id:'OT-014', name:'STRAWBERRY MILK',        category:'others', emoji:'🦊', image:'images/ot014.png' },
    { id:'OT-015', name:'FUCK OFF',               category:'others', emoji:'🦊', image:'images/ot015.png' },
    { id:'OT-016', name:'SUSHI',                  category:'others', emoji:'🦊', image:'images/ot016.png' },
    { id:'OT-017', name:'TRASHER',                category:'others', emoji:'🦊', image:'images/ot017.png' },
  ];

  for (const s of STICKERS) {
    insert.run({
      sticker_id: s.id,
      name: s.name,
      category_slug: s.category,
      price: 3,
      currency: 'MAD',
      emoji: s.emoji,
      image: s.image || '',
      stock: 100,
      status: 'in_stock',
      is_new: 1,
    });
  }
}

module.exports = { db, setup };
