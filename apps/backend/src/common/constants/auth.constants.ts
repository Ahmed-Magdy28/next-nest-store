export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_MIN_UPPERCASE = 1;
export const PASSWORD_MIN_LOWERCASE = 1;
export const PASSWORD_MIN_DIGITS = 1;
export const PASSWORD_MIN_SPECIAL_CHARS = 1;

export const PASSWORD_LENGTH_MESSAGE = `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`;

export const PASSWORD_UPPERCASE_MESSAGE = `Password must contain at least ${PASSWORD_MIN_UPPERCASE} uppercase letter(s).`;

export const PASSWORD_LOWERCASE_MESSAGE = `Password must contain at least ${PASSWORD_MIN_LOWERCASE} lowercase letter(s).`;

export const PASSWORD_DIGIT_MESSAGE = `Password must contain at least ${PASSWORD_MIN_DIGITS} number(s).`;

export const PASSWORD_SPECIAL_CHAR_MESSAGE = `Password must contain at least ${PASSWORD_MIN_SPECIAL_CHARS} special character(s).`;

export const PASSWORD_MESSAGE =
  `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters and contain at least ` +
  `${PASSWORD_MIN_UPPERCASE} uppercase letter(s), ${PASSWORD_MIN_LOWERCASE} lowercase letter(s), ${PASSWORD_MIN_DIGITS} number(s), and ${PASSWORD_MIN_SPECIAL_CHARS} special character(s).`;
