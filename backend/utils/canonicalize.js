function canonicalize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  const keys = Object.keys(obj).sort();
  const res = {};
  for (const k of keys) res[k] = canonicalize(obj[k]);
  return res;
}

module.exports = canonicalize;
