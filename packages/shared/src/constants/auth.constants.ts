export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_MIN_UPPERCASE = 1;
export const PASSWORD_MIN_LOWERCASE = 1;
export const PASSWORD_MIN_DIGITS = 1;
export const PASSWORD_MIN_SPECIAL_CHARS = 1;

export const PASSWORD_MUST_CONTAIN_UPPERCASE = /[A-Z]/;
export const PASSWORD_MUST_CONTAIN_LOWERCASE = /[a-z]/;
export const PASSWORD_MUST_CONTAIN_DIGITS = /\d/;
export const PASSWORD_MUST_CONTAIN_SPECIAL_CHARS = /[^\w\s]/;
export const PASSWORD_MUST_NOT_CONTAIN_WHITESPACE = /^\S*$/;
export const PASSWORD_MUST_NOT_CONTAIN_EQUAL = /^(?!.*(.).*\1).*$/;

export const PASSWORD_MUST_NOT_EQUAL_USERNAME_MSG =
  "Password must not be the same as username.";

export const PASSWORD_MUST_NOT_CONTAIN_WHITESPACE_MSG = `Password must not contain whitespace.`;
export const PASSWORD_MUST_NOT_CONTAIN_EQUAL_MSG = `Password must not contain equal characters.`;

export const PASSWORD_LENGTH_MSG = `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`;

export const PASSWORD_UPPERCASE_MSG = `Password must contain at least ${PASSWORD_MIN_UPPERCASE} uppercase letter(s).`;
export const PASSWORD_LOWERCASE_MSG = `Password must contain at least ${PASSWORD_MIN_LOWERCASE} lowercase letter(s).`;

export const PASSWORD_DIGIT_MSG = `Password must contain at least ${PASSWORD_MIN_DIGITS} number(s).`;

export const PASSWORD_SPECIAL_CHAR_MSG = `Password must contain at least ${PASSWORD_MIN_SPECIAL_CHARS} special character(s).`;

export const PASSWORD_MESSAGE =
  `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters and contain at least ` +
  `${PASSWORD_MIN_UPPERCASE} uppercase letter(s), ${PASSWORD_MIN_LOWERCASE} lowercase letter(s), ${PASSWORD_MIN_DIGITS} number(s), and ${PASSWORD_MIN_SPECIAL_CHARS} special character(s).`;
