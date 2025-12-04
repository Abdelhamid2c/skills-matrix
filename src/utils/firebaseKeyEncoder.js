/**
 * Encoder les clés pour Firebase
 * Firebase n'accepte pas . # $ / [ ] dans les clés
 */

const FORBIDDEN_CHARS = {
  '.': '%2E',
  '#': '%23',
  '$': '%24',
  '/': '%2F',
  '[': '%5B',
  ']': '%5D',
  ' ': '_' // Remplacer les espaces par des underscores
};

const REVERSE_CHARS = Object.fromEntries(
  Object.entries(FORBIDDEN_CHARS).map(([key, value]) => [value, key])
);

/**
 * Encoder une clé pour Firebase
 */
export const encodeFirebaseKey = (key) => {
  if (typeof key !== 'string') return key;

  let encoded = key;
  Object.entries(FORBIDDEN_CHARS).forEach(([char, replacement]) => {
    encoded = encoded.split(char).join(replacement);
  });

  return encoded;
};

/**
 * Décoder une clé Firebase
 */
export const decodeFirebaseKey = (key) => {
  if (typeof key !== 'string') return key;

  let decoded = key;
  Object.entries(REVERSE_CHARS).forEach(([encoded, original]) => {
    decoded = decoded.split(encoded).join(original);
  });

  return decoded;
};

/**
 * Encoder récursivement un objet pour Firebase
 */
export const encodeObjectForFirebase = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => encodeObjectForFirebase(item));
  }

  const encoded = {};
  Object.entries(obj).forEach(([key, value]) => {
    const encodedKey = encodeFirebaseKey(key);
    encoded[encodedKey] = encodeObjectForFirebase(value);
  });

  return encoded;
};

/**
 * Décoder récursivement un objet depuis Firebase
 */
export const decodeObjectFromFirebase = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => decodeObjectFromFirebase(item));
  }

  const decoded = {};
  Object.entries(obj).forEach(([key, value]) => {
    const decodedKey = decodeFirebaseKey(key);
    decoded[decodedKey] = decodeObjectFromFirebase(value);
  });

  return decoded;
};

export default {
  encodeFirebaseKey,
  decodeFirebaseKey,
  encodeObjectForFirebase,
  decodeObjectFromFirebase
};
