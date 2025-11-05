import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';
import users from '@/data/users.json';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Missing username or password' },
      { status: 400 }
    );
  }

  const user = users.users.find(u => u.username === username);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Create session cookie here
  const response = NextResponse.json(
    { message: 'Logged in successfully' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'session',
    value: user.id,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/'
  });

  return response;
}