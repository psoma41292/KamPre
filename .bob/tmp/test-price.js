// Test price parsing
function parsePrice(raw) {
  if (typeof raw === 'number') return Math.round(raw);
  if (!raw) return null;
  let s = String(raw).replace(/₹/g, '').replace(/Rs\.?\s*/gi, '').replace(/\s/g, '').trim();
  s = s.replace(/,(\d{3})/g, '$1');
  const num = parseFloat(s);
  return isNaN(num) ? null : Math.round(num);
}

const cases = [
  ['664.05',   664],
  ['₹664.05',  664],
  ['1,299',    1299],
  ['1,299.50', 1300],
  ['₹120',     120],
  ['Rs. 109',  109],
  ['66,405',   66405],
  [120,        120],
  ['₹1,099',   1099],
];

let ok = true;
cases.forEach(([input, expected]) => {
  const got = parsePrice(input);
  const pass = got === expected;
  console.log(pass ? 'PASS' : 'FAIL', String(input).padEnd(12), '->', got, pass ? '' : '(expected ' + expected + ')');
  if (!pass) ok = false;
});
console.log(ok ? '\nAll price tests passed' : '\nFAILURES above');
