import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { flattenError, z, type ZodType } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (
      metadata.type !== "body" &&
      metadata.type !== "query" &&
      metadata.type !== "param"
    ) {
      return value;
    }

    // When the same pipe is applied to a whole route (e.g. @UsePipes),
    // it also runs against `:id` params. If the schema expects an object
    // but the value isn't one, skip validation (let @Param handle it).
    if (!this.shouldValidate(value)) {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const error = flattenError(result.error);

      throw new BadRequestException([
        ...error.formErrors,
        ...Object.values(error.fieldErrors).flat(),
      ]);
    }

    return result.data;
  }

  /**
   * Returns true if the value's shape matches what the schema expects.
   * - Object schemas require the value to be a plain object.
   * - Non-object schemas (string/number/array/etc.) are always validated.
   *
   * Uses Zod v4's official `instanceof` checks against `z.ZodObject` —
   * this is stable and doesn't rely on internal `_def.typeName`.
   */
  private shouldValidate(value: unknown): boolean {
    const isObjectSchema = this.schema instanceof z.ZodObject;

    if (isObjectSchema) {
      return (
        typeof value === "object" && value !== null && !Array.isArray(value)
      );
    }

    return true;
  }
}
