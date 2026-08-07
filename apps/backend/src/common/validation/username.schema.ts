import { z } from "zod";
import {
  USERNAME_LENGTH_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MESSAGE,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "../constants/user.constants";

export const usernameSchema = z
  .string()
  .trim()
  .min(USERNAME_MIN_LENGTH, USERNAME_LENGTH_MESSAGE)
  .max(USERNAME_MAX_LENGTH, USERNAME_LENGTH_MESSAGE)
  .regex(USERNAME_REGEX, USERNAME_MESSAGE);
