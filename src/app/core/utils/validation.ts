export function isValidName(input: string): boolean {
  if (!input) return false;
  return /^[A-Za-zÄÖÜäöüß\s]+$/.test(input.trim());
}

export function isValidEmail(input: string): boolean {
  if (!input) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export function isValidPhone(input: string): boolean {
  if (!input) return false;

  if (input.startsWith('+')) {
    const digits = input.slice(1);
    return /^\d+$/.test(digits) && digits.length >= 10;
  }

  return /^\d+$/.test(input) && input.length >= 10;
}


export function isValidPassword(input: string): boolean {
  if (!input) return false;
  return input.length >= 8;
}
