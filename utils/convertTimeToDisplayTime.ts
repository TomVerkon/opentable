export function convertTimeToDisplayTime(timestamp: string) {
  let hms = timestamp.split(':');
  let hours = parseInt(hms[0]);
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${String(hours12)}:${hms[1]} ${amOrPm}`;
}
