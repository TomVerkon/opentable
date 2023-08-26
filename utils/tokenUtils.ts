import * as jose from 'jose';
import * as utils from './utils';

export async function getSignedToken(email: string): Promise<string> {
  const alg = utils.getAlgorythm();
  const expTime = utils.getExpirationTime();
  const secret = utils.getSecret();
  return await new jose.SignJWT({ email })
    .setProtectedHeader({ alg })
    .setExpirationTime(expTime)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    await jose.jwtVerify(token, utils.getSecret());
  } catch (error) {
    throw new Error('Invalid Token');
  }
}
