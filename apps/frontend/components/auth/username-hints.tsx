"use client";

import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@repo/shared/constants";

export function UsernameHints() {
  return (
    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
      Must be {USERNAME_MIN_LENGTH}–{USERNAME_MAX_LENGTH} characters, start with
      a letter, and contain only letters, numbers, underscores, and dots.
    </p>
  );
}
