import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/tokenUtils';

function getErrorResponse(errorCode: string) {
  return new NextResponse(JSON.stringify({ errorMessage: `Unauthorized request (${errorCode})` }), {
    status: 401,
  });
}

// error codes:
//        121 = No bearer Token
//        137 = No Token
//        143 = Token invalid
export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization') as string | undefined;
  if (!bearerToken) return getErrorResponse('121');

  const token = bearerToken.split(' ')[1] as string;
  if (!token) return getErrorResponse('137');

  try {
    await verifyToken(token);
  } catch (error) {
    return new NextResponse(JSON.stringify({ errorMessage: 'Unauthorized request (143)' }), {
      status: 401,
    });
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
