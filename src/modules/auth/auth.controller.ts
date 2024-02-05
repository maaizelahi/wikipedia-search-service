import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Username already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const token = await this.authService.registerUser(createUserDto);
      return { token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Username already exists');
      }
      if (error instanceof BadRequestException) {
        throw new ConflictException('Bad request');
      }
      // Handle other errors
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDto }) // Specify the DTO for request payload in Swagger
  @ApiResponse({ status: 200, description: 'Login successful', type: String })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const token = await this.authService.login(loginDto);
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
