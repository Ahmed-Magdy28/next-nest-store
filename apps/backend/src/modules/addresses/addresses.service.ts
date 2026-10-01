import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@repo/database";
import type {
  AddressDto,
  CreateAddressDto,
  UpdateAddressDto,
} from "@repo/shared/dtos/addresses";

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<AddressDto[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return addresses;
  }

  async findOne(userId: string, id: string): Promise<AddressDto> {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException("Address not found");
    }
    if (address.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    return address;
  }

  async create(userId: string, dto: CreateAddressDto): Promise<AddressDto> {
    const existingCount = await this.prisma.address.count({
      where: { userId },
    });

    const isFirst = existingCount === 0;
    const shouldBeDefault = dto.isDefault ?? isFirst;

    if (shouldBeDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const created = await this.prisma.address.create({
      data: {
        userId,
        label: dto.label ?? null,
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country || "Egypt",
        city: dto.city,
        area: dto.area ?? null,
        street: dto.street,
        building: dto.building ?? null,
        apartment: dto.apartment ?? null,
        postalCode: dto.postalCode ?? null,
        isDefault: shouldBeDefault,
      },
    });

    return created;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<AddressDto> {
    await this.findOne(userId, id);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.address.update({
      where: { id },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.area !== undefined && { area: dto.area }),
        ...(dto.street !== undefined && { street: dto.street }),
        ...(dto.building !== undefined && { building: dto.building }),
        ...(dto.apartment !== undefined && { apartment: dto.apartment }),
        ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });

    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const address = await this.findOne(userId, id);

    await this.prisma.address.delete({
      where: { id },
    });

    // If the deleted address was default, promote the latest remaining address
    if (address.isDefault) {
      const remaining = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (remaining) {
        await this.prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }
  }

  async setDefault(userId: string, id: string): Promise<AddressDto> {
    await this.findOne(userId, id);

    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    const updated = await this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return updated;
  }
}
