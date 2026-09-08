export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 30;

export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_.]{3,29}$/;
export const USERNAME_LENGTH_MSG = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters.`;
export const USERNAME_MUST_NOT_CONTAIN_EQUAL = /^(?!.*(.).*\1).*$/;
export const USERNAME_MUST_NOT_CONTAIN_EQUAL_MSG = `Username must not contain equal characters.`;

export const USERNAME_MSG =
  "Username must start with a letter and contain only letters, numbers, underscores, and dots.";
