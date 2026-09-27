"use client";

import { Check, X } from "lucide-react";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MUST_CONTAIN_UPPERCASE,
  PASSWORD_MUST_CONTAIN_LOWERCASE,
  PASSWORD_MUST_CONTAIN_DIGITS,
  PASSWORD_MUST_CONTAIN_SPECIAL_CHARS,
  PASSWORD_MUST_NOT_CONTAIN_WHITESPACE,
  PASSWORD_MUST_NOT_CONTAIN_EQUAL,
} from "@repo/shared/constants";

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const RULES: Rule[] = [
  {
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH,
  },
  {
    label: `Max ${PASSWORD_MAX_LENGTH} characters`,
    test: (v) => v.length <= PASSWORD_MAX_LENGTH,
  },
  {
    label: "At least 1 uppercase letter",
    test: (v) => PASSWORD_MUST_CONTAIN_UPPERCASE.test(v),
  },
  {
    label: "At least 1 lowercase letter",
    test: (v) => PASSWORD_MUST_CONTAIN_LOWERCASE.test(v),
  },
  {
    label: "At least 1 number",
    test: (v) => PASSWORD_MUST_CONTAIN_DIGITS.test(v),
  },
  {
    label: "At least 1 special character",
    test: (v) => PASSWORD_MUST_CONTAIN_SPECIAL_CHARS.test(v),
  },
  {
    label: "No whitespace",
    test: (v) => PASSWORD_MUST_NOT_CONTAIN_WHITESPACE.test(v),
  },
  {
    label: "No equal characters (=)",
    test: (v) => PASSWORD_MUST_NOT_CONTAIN_EQUAL.test(v),
  },
];

interface PasswordChecklistProps {
  value: string;
  className?: string;
}

export function PasswordChecklist({
  value,
  className = "",
}: PasswordChecklistProps) {
  if (!value) return null;

  return (
    <ul
      className={`mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2 ${className}`}
    >
      {RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 ${
              ok
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {ok ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <X className="h-3 w-3 shrink-0" />
            )}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
