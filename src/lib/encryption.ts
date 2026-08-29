import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
  const raw = process.env.PASSWORD_ENCRYPTION_KEY || 'lovelearn-default-32-char-key-ok!';
  return crypto.createHash('sha256').update(raw).digest();
}

export function encryptPassword(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `enc:${iv.toString('hex')}:${encrypted}`;
}

export function decryptPassword(cipherText: string): string {
  if (cipherText.startsWith('enc:')) {
    const parts = cipherText.split(':');
    const iv = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  return '[Legacy bcrypt - reset required]';
}

export function isEncrypted(password: string): boolean {
  return password.startsWith('enc:');
}
