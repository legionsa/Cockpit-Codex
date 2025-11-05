import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session?.value) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
}