import prisma from '@/utils/client';
import { getSignupValidatorSchema } from '@/utils/getSignupValidatorSchema';
import { getSignedToken } from '@/utils/tokenUtils';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, city, phone, email, password } = req.body;
    const errors: string[] = [];
    const validationSchema = getSignupValidatorSchema(req.body);
    validationSchema.forEach(check => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ errorMessages: errors });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) return res.status(400).json({ errorMessage: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        city,
        password: hashedPassword,
        phone,
      },
    });

    const token = await getSignedToken(email);
    res.status(200).send({ token });
  } else {
    res.status(404).json('Unknown endpoint');
  }
}
