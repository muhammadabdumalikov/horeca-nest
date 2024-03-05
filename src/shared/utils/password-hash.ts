import * as bcrypt from 'bcrypt';

export async function createPasswordHash(password: string) {
  const saltRounds = Number(process.env.BCRYPT_SALT);
  return bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      return bcrypt.hash(password, salt)
    })
    .then(hash => {
      return hash;
    })
    .catch(err => console.error(err.message))
}

export async function validateUserPassword(hash, password) {
  return bcrypt
    .compare(password, hash)
    .then(res => {
      return res;
    })
    .catch(err => {      
      return false;
    })
}

export function generateOrderCode(chars_length = 3, numbers_length = 8) {
  const UPPERCASE_CHARS = 'BCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < chars_length; i++) {
    result += UPPERCASE_CHARS.charAt(Math.floor(Math.random() * UPPERCASE_CHARS.length));
  }

  for (let i = 0; i < numbers_length; i++) {
    result += Math.floor(Math.random() * 9);
  }

  return result;
}

export function generateProductBarcodeCode(chars_length = 2, numbers_length = 8) {
  const UPPERCASE_CHARS = 'BCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < chars_length; i++) {
    result += UPPERCASE_CHARS.charAt(Math.floor(Math.random() * UPPERCASE_CHARS.length));
  }

  result += '-';

  for (let i = 0; i < numbers_length; i++) {
    result += Math.floor(Math.random() * 9);
  }

  return result;
}