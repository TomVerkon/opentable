import validator from 'validator';

interface Body {
  email: string;
  password: string;
}

export function getSigninValidatorSchema({ email, password }: Body) {
  return [
    {
      valid: validator.isEmail(email),
      errorMessage: 'Email is invalid',
    },
    {
      valid: validator.isLength(password, { min: 1 }),
      errorMessage: 'Password is required',
    },
  ];
}
