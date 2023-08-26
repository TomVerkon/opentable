import validator from 'validator';

interface Body {
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  email: string;
  password: string;
}

export function getSignupValidatorSchema({
  firstName,
  lastName,
  city,
  phone,
  email,
  password,
}: Body) {
  return [
    {
      valid: validator.isLength(firstName, {
        min: 1,
        max: 20,
      }),
      errorMessage: 'First Name must be between 1 and 20 characters long',
    },
    {
      valid: validator.isLength(lastName, {
        min: 1,
        max: 20,
      }),
      errorMessage: 'Last Name must be between 1 and 20 characters long',
    },
    {
      valid: validator.isLength(city, {
        min: 1,
        max: 20,
      }),
      errorMessage: 'City must be between 1 and 20 characters long',
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: 'Phone is invalid',
    },
    {
      valid: validator.isEmail(email),
      errorMessage: 'Email is invalid',
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: 'Password is invalid',
    },
  ];
}
