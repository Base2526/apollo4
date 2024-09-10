// encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'a4'; // Replace with a strong secret key

export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (data: string): string => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};