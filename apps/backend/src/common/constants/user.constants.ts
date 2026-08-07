export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 30;

export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_.]{3,29}$/;
export const USERNAME_LENGTH_MESSAGE = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters.`;
export const USERNAME_MESSAGE =
  "Username must start with a letter and contain only letters, numbers, underscores, and dots.";
