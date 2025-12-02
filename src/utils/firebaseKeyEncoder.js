/**
 * Utilitaires pour encoder/décoder les clés Firebase
 * Firebase n'autorise pas: . # $ / [ ] dans les clés
 */

/**
 * Encoder une clé pour Firebase
 */
export const encodeFirebaseKey = (key) => {
  if (!key) return key;

  return key
    .replace(/\./g, '%2E')   // Point
    .replace(/#/g, '%23')    // Dièse
    .replace(/\$/g, '%24')   // Dollar
    .replace(/\//g, '%2F')   // Slash
    .replace(/\[/g, '%5B')   // Crochet ouvrant
    .replace(/\]/g, '%5D')   // Crochet fermant
    .replace(/,/g, '%2C')    // Virgule
    .replace(/\(/g, '%28')   // Parenthèse ouvrante
    .replace(/\)/g, '%29')   // Parenthèse fermante
    .replace(/"/g, '%22')    // Guillemet double
    .replace(/'/g, '%27');   // Guillemet simple
};

/**
 * Décoder une clé Firebase
 */
export const decodeFirebaseKey = (key) => {
  if (!key) return key;

  return key
    .replace(/%2E/g, '.')
    .replace(/%23/g, '#')
    .replace(/%24/g, '$')
    .replace(/%2F/g, '/')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']')
    .replace(/%2C/g, ',')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%22/g, '"')
    .replace(/%27/g, "'");
};

/**
 * Encoder récursivement un objet pour Firebase
 */
export const encodeObjectForFirebase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => encodeObjectForFirebase(item));
  }

  const encoded = {};

  Object.entries(obj).forEach(([key, value]) => {
    const encodedKey = encodeFirebaseKey(key);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      encoded[encodedKey] = encodeObjectForFirebase(value);
    } else if (Array.isArray(value)) {
      encoded[encodedKey] = value.map(item => encodeObjectForFirebase(item));
    } else {
      encoded[encodedKey] = value;
    }
  });

  return encoded;
};

/**
 * Décoder récursivement un objet Firebase
 */
export const decodeObjectFromFirebase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => decodeObjectFromFirebase(item));
  }

  const decoded = {};

  Object.entries(obj).forEach(([key, value]) => {
    const decodedKey = decodeFirebaseKey(key);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      decoded[decodedKey] = decodeObjectFromFirebase(value);
    } else if (Array.isArray(value)) {
      decoded[decodedKey] = value.map(item => decodeObjectFromFirebase(item));
    } else {
      decoded[decodedKey] = value;
    }
  });

  return decoded;
};

export default {
  encodeFirebaseKey,
  decodeFirebaseKey,
  encodeObjectForFirebase,
  decodeObjectFromFirebase
};
