// Email regex (simple, practical)
export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Strong password: min 8 chars, upper, lower, number, special
export const isStrongPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);

// Indian-style phone (10 digits) or general numeric length 10–15
export const isPhone = (value) =>
  /^[0-9]{10,15}$/.test(value);

export const required = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export const match = (a, b) => a === b;