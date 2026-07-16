const fs = require('fs');
let src = fs.readFileSync('./backend/data/mockProducts.js', 'utf8');

// Replace all 'https://www.dmart.in/search?q=X' with 'https://www.dmart.in/product-search#q=X&start=0'
src = src.replace(/https:\/\/www\.dmart\.in\/search\?q=([^"]+)/g, function(match, term) {
  return 'https://www.dmart.in/product-search#q=' + term + '&start=0';
});

fs.writeFileSync('./backend/data/mockProducts.js', src, 'utf8');

const matches = src.match(/dmart\.in[^"]+/g);
const unique = matches.filter(function(v, i, a) { return a.indexOf(v) === i; });
console.log('DMart links after fix:');
unique.forEach(function(m) { console.log(' ', m); });
