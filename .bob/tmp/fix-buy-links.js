const fs = require('fs');
let src = fs.readFileSync('./backend/data/mockProducts.js', 'utf8');

// Each entry: [old link string, new link with brand+product in search term]
// Amazon: https://www.amazon.in/s?k=EXACT+BRAND+PRODUCT
// Flipkart: https://www.flipkart.com/search?q=EXACT+BRAND+PRODUCT

const fixes = [
  // ── TOOR DAL ──
  [
    'https://www.amazon.in/s?k=toor+dal',
    'https://www.amazon.in/s?k=Tata+Sampann+Unpolished+Toor+Dal+1+kg'
  ],
  [
    'https://www.flipkart.com/search?q=toor+dal',
    'https://www.flipkart.com/search?q=Toor+Dal+1+kg&otracker=search'
  ],

  // ── MOONG DAL ──
  [
    'https://www.amazon.in/s?k=moong+dal',
    'https://www.amazon.in/s?k=Tata+Sampann+Moong+Dal+Split+1+kg'
  ],
  [
    'https://www.flipkart.com/search?q=moong+dal',
    'https://www.flipkart.com/search?q=Patanjali+Moong+Dal+1+kg&otracker=search'
  ],

  // ── CHANA DAL ──
  [
    'https://www.amazon.in/s?k=chana+dal',
    'https://www.amazon.in/s?k=24+Mantra+Organic+Chana+Dal+500g'
  ],
  [
    'https://www.flipkart.com/search?q=chana+dal',
    'https://www.flipkart.com/search?q=Rajdhani+Chana+Dal+1+kg&otracker=search'
  ],

  // ── MASOOR DAL ──
  [
    'https://www.amazon.in/s?k=masoor+dal',
    'https://www.amazon.in/s?k=Tata+Sampann+Masoor+Dal+1+kg'
  ],

  // ── URAD DAL ──
  [
    'https://www.amazon.in/s?k=urad+dal',
    'https://www.amazon.in/s?k=Tata+Sampann+Urad+Dal+Split+1+kg'
  ],
  [
    'https://www.flipkart.com/search?q=urad+dal',
    'https://www.flipkart.com/search?q=Rajdhani+Urad+Dal+White+1+kg&otracker=search'
  ],

  // ── BASMATI RICE ──
  [
    'https://www.amazon.in/s?k=basmati+rice',
    'https://www.amazon.in/s?k=India+Gate+Classic+Basmati+Rice+5+kg'
  ],
  [
    'https://www.flipkart.com/search?q=basmati+rice',
    'https://www.flipkart.com/search?q=Kohinoor+Super+Silver+Basmati+Rice+5+kg&otracker=search'
  ],

  // ── POHA ──
  [
    'https://www.amazon.in/s?k=poha',
    'https://www.amazon.in/s?k=Saffola+Flattened+Rice+Poha+Thick+1+kg'
  ],

  // ── MILK ──
  [
    'https://www.amazon.in/s?k=amul+full+cream+milk',
    'https://www.amazon.in/s?k=Amul+Gold+Full+Cream+Milk+1+L'
  ],
  [
    'https://www.flipkart.com/search?q=full+cream+milk',
    'https://www.flipkart.com/search?q=Mother+Dairy+Full+Cream+Milk+1+L&otracker=search'
  ],

  // ── CURD ──
  [
    'https://www.amazon.in/s?k=amul+dahi',
    'https://www.amazon.in/s?k=Amul+Masti+Dahi+Curd+400g'
  ],

  // ── PANEER ──
  [
    'https://www.amazon.in/s?k=amul+paneer',
    'https://www.amazon.in/s?k=Amul+Fresh+Paneer+200g'
  ],

  // ── ATTA ──
  [
    'https://www.amazon.in/s?k=aashirvaad+atta',
    'https://www.amazon.in/s?k=Aashirvaad+Whole+Wheat+Atta+10+kg'
  ],
  [
    'https://www.flipkart.com/search?q=wheat+atta',
    'https://www.flipkart.com/search?q=Pillsbury+Chakki+Fresh+Atta+10+kg&otracker=search'
  ],

  // ── BESAN ──
  [
    'https://www.amazon.in/s?k=besan+gram+flour',
    'https://www.amazon.in/s?k=Rajdhani+Besan+1+kg'
  ],

  // ── SUGAR ──
  [
    'https://www.amazon.in/s?k=sugar+5kg',
    'https://www.amazon.in/s?k=Sugar+5+kg'
  ],
  [
    'https://www.flipkart.com/search?q=sugar',
    'https://www.flipkart.com/search?q=Patanjali+Sugar+5+kg&otracker=search'
  ],

  // ── SALT ──
  [
    'https://www.amazon.in/s?k=tata+salt',
    'https://www.amazon.in/s?k=Tata+Salt+1+kg+iodized'
  ],

  // ── COOKING OIL ──
  [
    'https://www.amazon.in/s?k=sunflower+oil+5l',
    'https://www.amazon.in/s?k=Fortune+Sunlite+Refined+Sunflower+Oil+5+L'
  ],
  [
    'https://www.flipkart.com/search?q=sunflower+oil',
    'https://www.flipkart.com/search?q=Gemini+Sunflower+Oil+5+L&otracker=search'
  ],

  // ── MUSTARD OIL ──
  [
    'https://www.amazon.in/s?k=mustard+oil',
    'https://www.amazon.in/s?k=Patanjali+Kachi+Ghani+Mustard+Oil+1+L'
  ],

  // ── GHEE ──
  [
    'https://www.amazon.in/s?k=amul+ghee+1l',
    'https://www.amazon.in/s?k=Amul+Pure+Ghee+1+L+tin'
  ],
  [
    'https://www.flipkart.com/search?q=amul+ghee',
    'https://www.flipkart.com/search?q=Amul+Pure+Ghee+1+L+tin&otracker=search'
  ],

  // ── TEA ──
  [
    'https://www.amazon.in/s?k=tata+tea+gold',
    'https://www.amazon.in/s?k=Tata+Tea+Gold+500g'
  ],
  [
    'https://www.flipkart.com/search?q=red+label+tea',
    'https://www.flipkart.com/search?q=Brooke+Bond+Red+Label+Tea+500g&otracker=search'
  ],

  // ── COFFEE ──
  [
    'https://www.amazon.in/s?k=nescafe+classic',
    'https://www.amazon.in/s?k=Nescafe+Classic+Instant+Coffee+200g'
  ],

  // ── BISCUITS ──
  [
    'https://www.amazon.in/s?k=parle+g+biscuits',
    'https://www.amazon.in/s?k=Parle+G+Original+Glucose+Biscuits+800g'
  ],

  // ── SOOJI ──
  [
    'https://www.amazon.in/s?k=sooji+rava+semolina',
    'https://www.amazon.in/s?k=MTR+Bombay+Rava+Sooji+1+kg'
  ],

  // ── TURMERIC ──
  [
    'https://www.amazon.in/s?k=turmeric+powder',
    'https://www.amazon.in/s?k=Tata+Sampann+Turmeric+Powder+500g'
  ],

  // ── RED CHILLI ──
  [
    'https://www.amazon.in/s?k=red+chilli+powder',
    'https://www.amazon.in/s?k=Everest+Red+Chilli+Powder+500g'
  ],

  // ── CORIANDER ──
  [
    'https://www.amazon.in/s?k=coriander+powder',
    'https://www.amazon.in/s?k=Tata+Sampann+Coriander+Powder+200g'
  ],

  // ── TOMATO KETCHUP ──
  [
    'https://www.amazon.in/s?k=kissan+ketchup',
    'https://www.amazon.in/s?k=Kissan+Fresh+Tomato+Ketchup+900g'
  ],

  // ── BUTTER ──
  [
    'https://www.amazon.in/s?k=amul+butter',
    'https://www.amazon.in/s?k=Amul+Butter+Salted+500g'
  ],

  // ── EGGS ──
  [
    'https://www.amazon.in/s?k=eggs+12pcs',
    'https://www.amazon.in/s?k=Fresh+White+Eggs+12+pieces'
  ],

  // ── NOODLES ──
  [
    'https://www.amazon.in/s?k=maggi+noodles',
    'https://www.amazon.in/s?k=Maggi+2+Minute+Noodles+Masala+12+pack+70g'
  ],
];

let count = 0;
for (const [oldLink, newLink] of fixes) {
  const needle = '"' + oldLink + '"';
  if (src.includes(needle)) {
    src = src.split(needle).join('"' + newLink + '"');
    count++;
  } else {
    console.warn('  NOT FOUND:', oldLink);
  }
}

fs.writeFileSync('./backend/data/mockProducts.js', src, 'utf8');
console.log('Fixed', count, 'of', fixes.length, 'links');
