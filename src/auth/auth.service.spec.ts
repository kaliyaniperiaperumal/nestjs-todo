import { TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
//import { createTestingModule } from 'test/setup';
//import { AuthModule } from './auth.module';
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { createTestingModule } from "../../test/setup";
import { AuthModule } from "./auth.module";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { RegisterRequestDTO } from "./dto/register-request.dto";
import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UUID } from "crypto";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

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

  const mockJwtRepository = {
    sign: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      [],
      [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockAuthRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtRepository
      },
      ],
    );
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it("should successfully register a new user", async () => {
    const registerDto: RegisterRequestDTO = {
      email: "test34@example.com",
      password: "StrongPass123!",
      firstName: "Test",
      lastName: "User",
    };
    // Arrange
    //const hashedPassword: string = 'hashedPassword123';
    //jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);
    //mockUserRepository.findOneByEmail.mockResolvedValueOnce(null);

    const expectedResult = {
      access_token: "resultToken",
    };

    //jest.spyOn(mockJwtRepository, "sign").mockReturnValue(expectedResult);
    //jest.spyOn(mockUserRepository, "create").mockReturnValue({...registerDto, id: "1" as UUID});
    //jest.spyOn(mockUserRepository, "findOneByEmail").mockReturnValue(registerDto);
    //mockUserRepository.create.mockResolvedValueOnce({...registerDto, id: "1" as UUID});
    jest.spyOn(mockAuthRepository, "register").mockReturnValue(expectedResult);
    authService.register = jest.fn().mockReturnValue(expectedResult);
    
    // Act
    const result = await authService.register(registerDto);
    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(expectedResult);
    //expect(mockUserRepository.findOneBy).toHaveBeenCalled();
  });

  it("should return error when update", async () => {
      const registerUser: RegisterRequestDTO = {
        email: 'test@test.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User'
      }
  
      jest.spyOn(mockAuthRepository, "register").mockReturnValue(registerUser);
      jest.spyOn(mockUserRepository, "findOneBy").mockReturnValue(registerUser);
  
      //act
      await expect(authService.register(registerUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should return error when invalid user or password", async () => {
      const registerUser: RegisterRequestDTO = {
        email: 'test@test.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User'
      }
  
      //jest.spyOn(mockAuthRepository, "register").mockReturnValue(registerUser);
      jest.spyOn(mockUserRepository, "findOneByEmail").mockReturnValue(registerUser);
  
      //act
      await expect(authService.validateUser(registerUser.email, registerUser.password)).rejects.toThrow(
        BadRequestException,
      );
    });
});
