import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { flattenError, type ZodType } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== "body") {
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
}
