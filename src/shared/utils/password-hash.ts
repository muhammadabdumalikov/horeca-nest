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