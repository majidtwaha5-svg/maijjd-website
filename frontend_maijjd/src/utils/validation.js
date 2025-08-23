// Basic validation helpers used by auth forms

export function isEmail(value) {
  if (!value) return false;
  return /.+@.+\..+/.test(String(value).trim());
}

export function isPhone(value) {
  if (!value) return false;
  // Permissive E.164-ish or local numbers (digits, space, +, -, parentheses)
  return /^[+\d][\d\s().-]{6,}$/.test(String(value).trim());
}

export function validatePasswordStrong(password) {
  const pwd = String(password || '');
  const lengthOk = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  return {
    lengthOk,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    valid: lengthOk && hasUpper && hasLower && hasNumber && hasSymbol,
  };
}

export function splitEmailOrPhone(value) {
  const v = String(value || '').trim();
  if (isEmail(v)) return { email: v };
  if (isPhone(v)) return { phone: v.replace(/\s+/g, '') };
  return {};
}


