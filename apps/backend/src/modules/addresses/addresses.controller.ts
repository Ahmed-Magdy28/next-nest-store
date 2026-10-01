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
} from "@nestjs/common";
import { CurrentUser, UseZodValidation } from "../../common/decorators";
import type { JwtUser } from "@repo/shared/interfaces";
import type {
  AddressDto,
  CreateAddressDto,
  UpdateAddressDto,
} from "@repo/shared/dtos/addresses";
import {
  createAddressSchema,
  updateAddressSchema,
} from "@repo/shared/schemas/addresses";

import { AddressesService } from "./addresses.service";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser): Promise<AddressDto[]> {
    return this.addressesService.findAll(user.id);
  }

  @Post()
  @UseZodValidation(createAddressSchema)
  create(
    @CurrentUser() user: JwtUser,
    @Body() body: CreateAddressDto,
  ): Promise<AddressDto> {
    return this.addressesService.create(user.id, body);
  }

  @Patch(":id")
  @UseZodValidation(updateAddressSchema)
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateAddressDto,
  ): Promise<AddressDto> {
    return this.addressesService.update(user.id, id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.addressesService.delete(user.id, id);
  }

  @Patch(":id/default")
  setDefault(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<AddressDto> {
    return this.addressesService.setDefault(user.id, id);
  }
}
