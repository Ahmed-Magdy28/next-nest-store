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

  transform(value: unknown, _: ArgumentMetadata) {
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
