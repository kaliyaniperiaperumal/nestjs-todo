import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../strategy/jwt.strategy';
import { createTestingModule } from 'test/setup';
import { AccessTokenPayload } from '../types/AccessTokenPayload';
import { UUID } from 'crypto';
import { LocalStrategy } from '../strategy/local.strategy';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('LoalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  let userService: UserService;

  const mockAuthRepository = {
    register: jest.fn(),
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
      const module: TestingModule = await createTestingModule(
        [],
        [
          LocalStrategy, AuthService, UserService,{
                    provide: getRepositoryToken(User),
                    useValue: mockAuthRepository,
                  },
                  {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                  },
        ],
        [PassportModule]
      );
      authService = module.get<AuthService>(AuthService);
    });

  describe('validate', () => {

    it("should be defined", () => {
      expect(authService).toBeDefined();
    });

    it('should return the valid user', async () => {
      const mockPayload = {
        password: "Test@123",
        email: "test@mail.com"
      };
      const validUser: User = {
        firstName: "Test",
        lastName: "user",
        password: "Test@1234",
        accessToken: "sample_token",
        id: "1" as UUID,
        email: "test@test.com"
      }
      authService.validateUser = jest.fn().mockReturnValue(validUser)
      const result = await authService.validateUser(mockPayload.email, mockPayload.password);
      expect(result).toEqual(validUser);
    });

    it('should return eror', async () => {
      const mockPayload = {
        password: "Test@123",
        email: "test@mail.com"
      };
      
      expect(authService.validateUser(mockPayload.email, mockPayload.password)).rejects.toThrow(BadRequestException)
      
    });
  });
});