import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export const securityQuestions = {
  Q1: {
    question: 'Who is the first PM of BookCabin?',
    answer: 'Lita'
  },
  Q2: {
    question: 'Who is the first Product Designer of BookCabin?',
    answer: 'Ihsan Fauzan'
  },
  Q3: {
    question: 'What is company\'s car brand?',
    answer: 'Hyundai'
  }
};

export function generatePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  const upper = charset.match(/[A-Z]/)?.at(0) ?? 'A';
  const lower = charset.match(/[a-z]/)?.at(0) ?? 'a';
  const number = charset.match(/[0-9]/)?.at(0) ?? '1';
  const symbol = charset.match(/[!@#$%^&*]/)?.at(0) ?? '!';
  
  password += upper + lower + number + symbol;
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}