import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, 10);
};

export const comparePassword = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};
