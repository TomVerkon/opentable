import validator from 'validator';

interface Body {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}

export default function getReserveValidatorSchema({ slug, day, time, partySize }: Body) {
  return [
    {
      valid: validator.isLength(slug, { min: 5 }),
      errorMessage: 'slug is invalid',
    },
    {
      valid: validator.isLength(day, { min: 10, max: 10 }),
      errorMessage: 'day is invalid',
    },
  ];
}
