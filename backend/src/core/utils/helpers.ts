export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function getPaginationParams(page?: string | number, limit?: string | number): { skip: number; take: number } {
  const pageNum = Math.max(1, parseInt(String(page || 1)));
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || 10))));
  
  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
}
