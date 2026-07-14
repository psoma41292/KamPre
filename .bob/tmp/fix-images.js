const fs = require('fs');
let src = fs.readFileSync('./backend/data/mockProducts.js', 'utf8');

const replacements = [
  // toor dal
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/dal/z/e/e/1-toor-dal-arhar-dal-original-imaghcgrg3shybhf.jpeg', 'IMG.toor_dal'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/16555a.jpg', 'IMG.toor_dal'],
  ['https://www.bigbasket.com/media/uploads/p/l/30003506_6-bb-royal-toor-dal-arhar-dal.jpg', 'IMG.toor_dal'],
  ['https://www.swiggy.com/instamart/item/toor-dal', 'IMG.toor_dal'],
  ['https://www.dmart.in/images/products/toor-dal.jpg', 'IMG.toor_dal'],
  // moong dal
  ['https://m.media-amazon.com/images/I/71R8QhIiAVL._SX679_.jpg', 'IMG.moong_dal'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/dal/r/s/z/1-moong-dal-original-imagghy5kygzhhqm.jpeg', 'IMG.moong_dal'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/279441a.jpg', 'IMG.moong_dal'],
  ['https://www.bigbasket.com/media/uploads/p/l/30009699_4-bb-royal-moong-dal-split.jpg', 'IMG.moong_dal'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/moong-dal.jpg', 'IMG.moong_dal'],
  ['https://www.dmart.in/images/products/moong-dal.jpg', 'IMG.moong_dal'],
  // chana dal
  ['https://m.media-amazon.com/images/I/71A7xpvV2rL._SX679_.jpg', 'IMG.chana_dal'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/dal/d/q/j/1-chana-dal-original-imagghy5fjeyyhuf.jpeg', 'IMG.chana_dal'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/6869a.jpg', 'IMG.chana_dal'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002121_5-bb-royal-chana-dal.jpg', 'IMG.chana_dal'],
  ['https://www.dmart.in/images/products/chana-dal.jpg', 'IMG.chana_dal'],
  // masoor dal
  ['https://m.media-amazon.com/images/I/61oJlHzJRHL._SX679_.jpg', 'IMG.masoor_dal'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/408783a.jpg', 'IMG.masoor_dal'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002136_4-bb-royal-masoor-dal-whole.jpg', 'IMG.masoor_dal'],
  ['https://www.dmart.in/images/products/masoor-dal.jpg', 'IMG.masoor_dal'],
  // urad dal
  ['https://m.media-amazon.com/images/I/71Fq5Z4xqIL._SX679_.jpg', 'IMG.urad_dal'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/dal/s/a/u/1-urad-dal-original-imagghy5ghxjmwhm.jpeg', 'IMG.urad_dal'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002177_5-bb-royal-urad-dal.jpg', 'IMG.urad_dal'],
  ['https://www.dmart.in/images/products/urad-dal.jpg', 'IMG.urad_dal'],
  // rice
  ['https://m.media-amazon.com/images/I/71Wt51g-GLL._SX679_.jpg', 'IMG.rice'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/rice/i/d/k/5-super-silver-basmati-rice-original-imaghexkqgkeyrrg.jpeg', 'IMG.rice'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/330696a.jpg', 'IMG.rice'],
  ['https://www.bigbasket.com/media/uploads/p/l/30010148_11-bb-royal-basmati-rice.jpg', 'IMG.rice'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/basmati-rice.jpg', 'IMG.rice'],
  ['https://www.dmart.in/images/products/basmati-rice-5kg.jpg', 'IMG.rice'],
  // poha
  ['https://m.media-amazon.com/images/I/71cQIpQYDOL._SX679_.jpg', 'IMG.poha'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/406849a.jpg', 'IMG.poha'],
  ['https://www.bigbasket.com/media/uploads/p/l/40003895_7-bb-royal-thick-beaten-rice-poha.jpg', 'IMG.poha'],
  ['https://www.dmart.in/images/products/poha.jpg', 'IMG.poha'],
  // milk
  ['https://m.media-amazon.com/images/I/618r+0wXQUL._SX679_.jpg', 'IMG.milk'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/milk/w/u/e/1-full-cream-milk-original-imaghfyhg3ybzxrh.jpeg', 'IMG.milk'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/27616a.jpg', 'IMG.milk'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000051_24-nandini-full-cream-milk.jpg', 'IMG.milk'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/amul-taaza.jpg', 'IMG.milk'],
  ['https://www.dmart.in/images/products/amul-taaza-1l.jpg', 'IMG.milk'],
  // curd
  ['https://m.media-amazon.com/images/I/61P0QTy7lhL._SX679_.jpg', 'IMG.curd'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/153060a.jpg', 'IMG.curd'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000023_27-nandini-curd-set-dahi.jpg', 'IMG.curd'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/amul-dahi.jpg', 'IMG.curd'],
  ['https://www.dmart.in/images/products/amul-dahi-400g.jpg', 'IMG.curd'],
  // paneer
  ['https://m.media-amazon.com/images/I/61GFiNJLqoL._SX679_.jpg', 'IMG.paneer'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/117085a.jpg', 'IMG.paneer'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000137_15-nandini-paneer.jpg', 'IMG.paneer'],
  ['https://www.dmart.in/images/products/amul-paneer-200g.jpg', 'IMG.paneer'],
  // atta
  ['https://m.media-amazon.com/images/I/81TBi2tZOWL._SX679_.jpg', 'IMG.atta'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/flour/r/d/b/10-chakki-fresh-atta-original-imaghexkufnzqeyr.jpeg', 'IMG.atta'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/3406a.jpg', 'IMG.atta'],
  ['https://www.bigbasket.com/media/uploads/p/l/40029141_7-fortune-chakki-fresh-atta.jpg', 'IMG.atta'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/aashirvaad-atta.jpg', 'IMG.atta'],
  ['https://www.dmart.in/images/products/shaktibhog-atta-10kg.jpg', 'IMG.atta'],
  // besan
  ['https://m.media-amazon.com/images/I/71Sq6iu7WPL._SX679_.jpg', 'IMG.besan'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/38408a.jpg', 'IMG.besan'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002107_8-bb-royal-besan.jpg', 'IMG.besan'],
  ['https://www.dmart.in/images/products/besan-1kg.jpg', 'IMG.besan'],
  // sugar
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/sugar/g/z/c/5-sugar-original-imaghfyhfhpzxjg8.jpeg', 'IMG.sugar'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/383756a.jpg', 'IMG.sugar'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000091_24-bb-royal-sugar.jpg', 'IMG.sugar'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/madhur-sugar.jpg', 'IMG.sugar'],
  ['https://www.dmart.in/images/products/sugar-5kg.jpg', 'IMG.sugar'],
  // salt
  ['https://m.media-amazon.com/images/I/516eJLGmJwL._SX679_.jpg', 'IMG.salt'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/5741a.jpg', 'IMG.salt'],
  ['https://www.bigbasket.com/media/uploads/p/l/40026095_5-tata-salt-lite-low-sodium-salt.jpg', 'IMG.salt'],
  ['https://www.dmart.in/images/products/tata-salt-1kg.jpg', 'IMG.salt'],
  // cooking oil
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/edible-oil/k/v/j/5-sunflower-oil-original-imaghexke9fmyhhb.jpeg', 'IMG.cooking_oil'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/254886a.jpg', 'IMG.cooking_oil'],
  ['https://www.bigbasket.com/media/uploads/p/l/40006373_11-fortune-sunlite-refined-sunflower-oil.jpg', 'IMG.cooking_oil'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/saffola-gold.jpg', 'IMG.cooking_oil'],
  ['https://www.dmart.in/images/products/freedom-sunflower-oil-5l.jpg', 'IMG.cooking_oil'],
  // mustard oil
  ['https://m.media-amazon.com/images/I/61e1m6iKxGL._SX679_.jpg', 'IMG.mustard_oil'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/457614a.jpg', 'IMG.mustard_oil'],
  ['https://www.bigbasket.com/media/uploads/p/l/40047413_7-dhara-kachi-ghani-mustard-oil.jpg', 'IMG.mustard_oil'],
  ['https://www.dmart.in/images/products/patanjali-mustard-oil-1l.jpg', 'IMG.mustard_oil'],
  // ghee
  ['https://m.media-amazon.com/images/I/613-6b0C7nL._SX679_.jpg', 'IMG.ghee'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/ghee/z/k/o/1-pure-ghee-original-imaghfyg7fhxp6r9.jpeg', 'IMG.ghee'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/73573a.jpg', 'IMG.ghee'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000119_21-nandini-pure-ghee.jpg', 'IMG.ghee'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/amul-ghee.jpg', 'IMG.ghee'],
  ['https://www.dmart.in/images/products/amul-ghee-1l.jpg', 'IMG.ghee'],
  // tea
  ['https://m.media-amazon.com/images/I/61yGE8tCR0L._SX679_.jpg', 'IMG.tea'],
  ['https://rukminim2.flixcart.com/image/832/832/xif0q/tea/r/b/n/500-red-label-natural-care-original-imaghfyhgzgheubh.jpeg', 'IMG.tea'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/14558a.jpg', 'IMG.tea'],
  ['https://www.bigbasket.com/media/uploads/p/l/20000091_19-tata-tea-gold.jpg', 'IMG.tea'],
  ['https://www.dmart.in/images/products/tata-tea-premium-500g.jpg', 'IMG.tea'],
  // coffee
  ['https://m.media-amazon.com/images/I/71E0gMXtdNL._SX679_.jpg', 'IMG.coffee'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/5820a.jpg', 'IMG.coffee'],
  ['https://www.bigbasket.com/media/uploads/p/l/20001038_17-nescafe-classic-instant-coffee.jpg', 'IMG.coffee'],
  ['https://www.dmart.in/images/products/nescafe-classic-200g.jpg', 'IMG.coffee'],
  // biscuits
  ['https://m.media-amazon.com/images/I/61DfXb8SjvL._SX679_.jpg', 'IMG.biscuits'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12826a.jpg', 'IMG.biscuits'],
  ['https://www.bigbasket.com/media/uploads/p/l/40192753_3-parle-g-original-glucose-biscuits.jpg', 'IMG.biscuits'],
  ['https://www.dmart.in/images/products/parle-g-800g.jpg', 'IMG.biscuits'],
  // sooji
  ['https://m.media-amazon.com/images/I/71oFHrImqkL._SX679_.jpg', 'IMG.sooji'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/42975a.jpg', 'IMG.sooji'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002190_6-bb-royal-sooji-rava.jpg', 'IMG.sooji'],
  ['https://www.dmart.in/images/products/sooji-1kg.jpg', 'IMG.sooji'],
  // turmeric
  ['https://m.media-amazon.com/images/I/61Q7M8p1Q5L._SX679_.jpg', 'IMG.turmeric'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/22539a.jpg', 'IMG.turmeric'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002222_5-bb-royal-turmeric-powder.jpg', 'IMG.turmeric'],
  ['https://www.dmart.in/images/products/catch-turmeric-500g.jpg', 'IMG.turmeric'],
  // red chilli
  ['https://m.media-amazon.com/images/I/71D3oWWTn-L._SX679_.jpg', 'IMG.red_chilli'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/4671a.jpg', 'IMG.red_chilli'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002200_7-bb-royal-chilli-powder.jpg', 'IMG.red_chilli'],
  ['https://www.dmart.in/images/products/catch-red-chilli-500g.jpg', 'IMG.red_chilli'],
  // coriander
  ['https://m.media-amazon.com/images/I/71bXRGC9KZL._SX679_.jpg', 'IMG.coriander'],
  ['https://www.bigbasket.com/media/uploads/p/l/30002208_6-bb-royal-coriander-powder.jpg', 'IMG.coriander'],
  ['https://www.dmart.in/images/products/catch-coriander-200g.jpg', 'IMG.coriander'],
  // ketchup
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/460523a.jpg', 'IMG.ketchup'],
  ['https://www.bigbasket.com/media/uploads/p/l/40119009_8-kissan-fresh-tomato-ketchup.jpg', 'IMG.ketchup'],
  ['https://www.dmart.in/images/products/kissan-ketchup-900g.jpg', 'IMG.ketchup'],
  // butter
  ['https://m.media-amazon.com/images/I/61ZCoHJoO7L._SX679_.jpg', 'IMG.butter'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/56009a.jpg', 'IMG.butter'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000059_22-amul-butter-salted.jpg', 'IMG.butter'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/amul-butter.jpg', 'IMG.butter'],
  ['https://www.dmart.in/images/products/amul-butter-500g.jpg', 'IMG.butter'],
  // eggs
  ['https://m.media-amazon.com/images/I/51RI+7y5mwL._SX679_.jpg', 'IMG.eggs'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/516438a.jpg', 'IMG.eggs'],
  ['https://www.bigbasket.com/media/uploads/p/l/10000095_32-fresho-eggs-white-large.jpg', 'IMG.eggs'],
  ['https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/eggs-white.jpg', 'IMG.eggs'],
  // noodles
  ['https://m.media-amazon.com/images/I/71Tj5Dkf4tL._SX679_.jpg', 'IMG.noodles'],
  ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/5479a.jpg', 'IMG.noodles'],
  ['https://www.bigbasket.com/media/uploads/p/l/40159073_7-maggi-masala-noodles.jpg', 'IMG.noodles'],
  ['https://www.dmart.in/images/products/maggi-masala-12pack.jpg', 'IMG.noodles'],
  // remaining amazon oil
  ['https://m.media-amazon.com/images/I/617jZ8pafgL._SX679_.jpg', 'IMG.cooking_oil'],
  // amazon sugar
  ['https://m.media-amazon.com/images/I/71H+yrFhvLL._SX679_.jpg', 'IMG.sugar'],
  // amazon ketchup
  ['https://m.media-amazon.com/images/I/71wG+3dJQ9L._SX679_.jpg', 'IMG.ketchup'],
];

let count = 0;
for (const [oldUrl, newRef] of replacements) {
  const needle = JSON.stringify(oldUrl); // includes surrounding quotes
  if (src.includes(needle)) {
    src = src.split(needle).join(newRef);
    count++;
  }
}
require('fs').writeFileSync('./backend/data/mockProducts.js', src, 'utf8');
console.log('Replaced', count, 'of', replacements.length, 'image URLs');
