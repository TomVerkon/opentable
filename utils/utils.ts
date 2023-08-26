export function getAlgorythm(): string {
  const alg = process.env.ALG;
  if (!alg) throw new Error('ALG must be defined');
  return alg;
}

export function getExpirationTime(): string {
  const expTime = process.env.EXPIRE_TIME;
  if (!expTime) throw new Error('EXPIRE_TIME is not defined');
  return expTime;
}

export function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
}
