import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { createTestingModule } from "test/setup";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { RegisterRequestDTO } from "./dto/register-request.dto";
import { LoginRequestDTO } from "./dto/login-request.dto";

describe("AuthController", () => {
  let controller: AuthController;
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
        [AuthController],
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
      controller = module.get<AuthController>(AuthController);
    });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should successfully register a new user", async () => {
      const registerDto: RegisterRequestDTO = {
        email: "test34@example.com",
        password: "StrongPass123!",
        firstName: "Test",
        lastName: "User",
      };
  
      const expectedResult = {
        access_token: "resultToken",
      };
  
      jest.spyOn(mockJwtRepository, "sign").mockReturnValue("resultToken");
      controller.register = jest.fn().mockReturnValue(expectedResult);
      // Act
      const result = await controller.register(registerDto);
      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });

    it("should successfully logged in a user", async () => {
      const loginRequestDto: LoginRequestDTO = {
        email: "test34@example.com",
        password: "StrongPass123!",
      };
  
      const expectedResult = {
        access_token: "resultToken",
      };
  
      jest.spyOn(mockJwtRepository, "sign").mockReturnValue("resultToken");
      controller.login = jest.fn().mockReturnValue(expectedResult)
      // Act
      const result = await controller.login(loginRequestDto);
      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
    });
});
