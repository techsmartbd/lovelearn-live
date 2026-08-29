
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const ALGORITHM = 'aes-256-cbc';
function getKey() {
  const raw = process.env.PASSWORD_ENCRYPTION_KEY || 'lovelearn-default-32-char-key-ok!';
  return crypto.createHash('sha256').update(raw).digest();
}
function decryptPassword(cipherText) {
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
function isEncrypted(password) {
  return password.startsWith('enc:');
}

(async () => {
  try {
    const user = await prisma.user.findFirst({ where: { phone: '01800000000' } });
    if (!user) { console.log('ERROR: Test Student not found'); return; }
    console.log('Found:', user.name, user.phone);
    console.log('Is encrypted:', isEncrypted(user.password));
    const decrypted = decryptPassword(user.password);
    console.log('Decrypted:', decrypted);
    console.log('Match student123:', decrypted === 'student123');
    
    // Simulate full login flow
    const phone = '01800000000';
    const password = 'student123';
    const loginUser = await prisma.user.findFirst({ where: { OR: [{ phone }, { email: phone }] } });
    console.log('Login lookup:', loginUser ? 'FOUND' : 'NOT FOUND');
    
    if (loginUser) {
      let isValid = false;
      if (isEncrypted(loginUser.password)) {
        isValid = decryptPassword(loginUser.password) === password;
      } else {
        isValid = await bcrypt.compare(password, loginUser.password);
      }
      console.log('Login valid:', isValid);
      console.log('Account status:', loginUser.accountStatus);
      console.log('Is blocked:', loginUser.isBlocked);
      console.log('Role:', loginUser.role);
    }
  } catch(e) {
    console.error('Error:', e.message);
  }
  await prisma.$disconnect();
})();
