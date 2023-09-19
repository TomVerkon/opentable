export function dtToDate(day: string, time: string): Date {
  return new Date(`${day}T${time}`);
}

export function dtToISOStr(day: string, time: string): string {
  return dtToDate(day, time).toISOString();
}
