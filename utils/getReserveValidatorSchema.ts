import validator from 'validator';

export interface Body {
  bookerEmail: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerPhone: string;
  bookerOccasion?: string | null;
  bookerRequest?: string | null;
}

export function getReserveValidatorSchema({
  bookerEmail,
  bookerFirstName,
  bookerLastName,
  bookerPhone,
}: Body) {
  return [
    {
      valid: validator.isLength(bookerFirstName, { min: 1, max: 20 }),
      errorMessage: 'First Name must be between 1 and 20 characters long',
    },
    {
      valid: validator.isLength(bookerLastName, { min: 1, max: 20 }),
      errorMessage: 'Last Name must be between 1 and 20 characters long',
    },
    {
      valid: validator.isMobilePhone(bookerPhone),
      errorMessage: 'Phone is invalid',
    },
    {
      valid: validator.isEmail(bookerEmail),
      errorMessage: 'Email is invalid',
    },
  ];
}
