import bcrypt from 'bcrypt';

const saltRounds = 12;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};