import { applyDecorators, UsePipes } from "@nestjs/common";
import type { ZodType } from "zod";
// there was ZodSchema and i changed it to ZodType because deprecated in zod v3.20.2
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

export function UseZodValidation(schema: ZodType) {
  return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
