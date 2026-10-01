import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { UserRole } from "@repo/database";

import {
  CurrentUser,
  Public,
  Roles,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { JwtUser } from "@repo/shared/interfaces";

import { CouponsService } from "./coupons.service";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  listCouponsQuerySchema,
} from "@repo/shared/schemas/e-commerce/coupons";
import type {
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ListCouponsQueryDto,
  CouponDto,
  CouponValidationResultDto,
  PaginatedResultDto,
} from "@repo/shared/dtos/e-commerce";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // Admin: CRUD
  @Get()
  @Roles(UserRole.ADMIN)
  @Swagger("list-coupons")
  findAll(
    @Query(new ZodValidationPipe(listCouponsQuerySchema))
    query: ListCouponsQueryDto,
  ): Promise<PaginatedResultDto<CouponDto>> {
    return this.couponsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("get-coupon")
  findById(@Param("id", ParseUUIDPipe) id: string): Promise<CouponDto> {
    return this.couponsService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @Swagger("create-coupon")
  @UseZodValidation(createCouponSchema)
  create(@Body() body: CreateCouponDto): Promise<CouponDto> {
    return this.couponsService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("update-coupon")
  @UseZodValidation(updateCouponSchema)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateCouponDto,
  ): Promise<CouponDto> {
    return this.couponsService.update(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("delete-coupon")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.couponsService.delete(id);
  }

  @Post("validate")
  @Public()
  @Swagger("validate-coupon")
  @UseZodValidation(validateCouponSchema)
  validate(
    @Body() body: ValidateCouponDto,
    @CurrentUser() user?: JwtUser,
  ): Promise<CouponValidationResultDto> {
    return this.couponsService.validate(
      body.code,
      user?.id ?? null,
      body.subtotal ?? 0,
    );
  }
}

