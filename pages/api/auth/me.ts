import prisma from '@/utils/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// error code:
//        121 = No bearer Token
//        137 = No Token
//        143 = Token invalid
//        167 = Email not found

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bearerToken = req.headers['authorization'] as string;
  const token = bearerToken.split(' ')[1] as string;
  const { email } = jwt.decode(token) as { email: string };

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      city: true,
      phone: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(401).json({ errorMessage: 'Unauthorized request (167)' });
  } else {
    return res.status(200).json(user);
  }
}
