import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { email, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userRepository.createUser(
      email,
      hashedPassword,
      firstName,
      lastName,
    );

    return plainToClass(ResponseUserDto, user, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) =>
      plainToClass(ResponseUserDto, user, { excludeExtraneousValues: true }),
    );
  }

  async findById(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToClass(ResponseUserDto, user, { excludeExtraneousValues: true });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If email is being updated, check if it's already taken
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    // If password is being updated, hash it
    const updateData: Partial<UpdateUserDto> = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateData as any);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return plainToClass(ResponseUserDto, updatedUser, { excludeExtraneousValues: true });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.softDeleteUser(id);
  }
}
