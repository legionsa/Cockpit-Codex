import { NextResponse } from 'next/server';
import { securityQuestions, generatePassword, hashPassword } from '@/lib/auth';
import users from '@/data/users.json';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { answers } = await request.json();

  // Verify all answers
  for (const [key, { answer }] of Object.entries(securityQuestions)) {
    if (answers[key]?.toLowerCase() !== answer.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid answers' },
        { status: 401 }
      );
    }
  }

  // Generate new password
  const newPassword = generatePassword();
  const hashedPassword = await hashPassword(newPassword);

  // Update user password
  const updatedUsers = {
    users: users.users.map(user => ({
      ...user,
      passwordHash: hashedPassword
    }))
  };

  // Save to file
  const usersPath = path.join(process.cwd(), 'src/data/users.json');
  await fs.writeFile(usersPath, JSON.stringify(updatedUsers, null, 2));

  return NextResponse.json({ newPassword }, { status: 200 });
}