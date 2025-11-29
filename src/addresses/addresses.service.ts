import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UsersService } from '../users/users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: string) {
    return this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    const user = await this.usersService.findOne(userId);
    if (dto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId } },
        { isDefault: false },
      );
    }
    const address = this.addressRepository.create({ ...dto, user });
    return this.addressRepository.save(address);
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.findOne(userId, addressId);
    if (dto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId } },
        { isDefault: false },
      );
    }
    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async remove(userId: string, addressId: string) {
    const address = await this.findOne(userId, addressId);
    return this.addressRepository.remove(address);
  }

  async findOne(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }
}
