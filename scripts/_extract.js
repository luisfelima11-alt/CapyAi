const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function extractBalanced(src, name) {
  const marker = 'const ' + name + ' = ';
  const start = src.indexOf(marker);
  if (start === -1) throw new Error('not found: ' + name);
  const openIdx = start + marker.length;
  const openChar = src[openIdx];
  const closeChar = openChar === '[' ? ']' : '}';
  let depth = 0;
  let i = openIdx;
  let inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  return src.slice(openIdx, i);
}

module.exports = { extractBalanced };

if (require.main === module) {
  const [,, file, name] = process.argv;
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  const code = extractBalanced(src, name);
  const val = new Function('return ' + code)();
  console.log('length:', Array.isArray(val) ? val.length : Object.keys(val).length);
  fs.writeFileSync(path.join(root, 'scripts', '_extracted_' + name + '.json'), JSON.stringify(val, null, 2), 'utf8');
  console.log('written to scripts/_extracted_' + name + '.json');
}
