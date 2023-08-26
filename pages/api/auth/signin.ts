import prisma from '@/utils/client';
import { getSigninValidatorSchema } from '@/utils/getSigninValidatorSchema';
import { getSignedToken } from '@/utils/tokenUtils';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const errors: string[] = [];

    const validationSchema = getSigninValidatorSchema(req.body);
    validationSchema.forEach(check => {
      if (!check.valid) errors.push(check.errorMessage);
    });

    if (errors.length > 0) return res.status(400).json({ errorMessages: errors });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ errorMessage: 'Invalid login credentials' });
    }
    const hashedPassword = existingUser.password;
    const passwordsMatch: boolean = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      const token = await getSignedToken(email);
      return res.status(200).send({ token });
    } else {
      return res.status(400).json({ errorMessage: 'Invalid login credentials' });
    }
  } else {
    return res.status(404).json('Unknown endpoint');
  }
}
