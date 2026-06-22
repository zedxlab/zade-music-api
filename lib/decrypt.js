const { createDecipheriv } = require('crypto');

function decryptUrl(encryptedB64) {
  try {
    const key = Buffer.from('38346591', 'utf-8');
    const encrypted = Buffer.from(encryptedB64, 'base64');
    const decipher = createDecipheriv('des-ecb', key, null);
    let decrypted = decipher.update(encrypted, null, 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted.replace(/_96/g, '_320');
  } catch {
    return null;
  }
}

module.exports = { decryptUrl };
