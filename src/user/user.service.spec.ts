import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { createTestingModule } from "test/setup";
import { UserModule } from "./user.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { RegisterRequestDTO } from "src/auth/dto/register-request.dto";
import { UUID } from "crypto";

describe("UserService", () => {
  let service: UserService;

  const mockUserRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      [],
      [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    );
    service = module.get<UserService>(UserService);
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       UserService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useValue: mockUserRepository,
  //       }
  //     ]
  //   }).compile();
  //   service = module.get<UserService>(UserService)
  // })

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("create => Should create a new user and return its data", async () => {
    // arrange
    const registerUserDto = {
      id: "1" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@123",
    } as RegisterRequestDTO;

    const user = {
      id: "1" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    } as User;

    jest.spyOn(mockUserRepository, "save").mockReturnValue(user);

    // act
    const result = await service.create(registerUserDto);

    // assert
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(registerUserDto);

    expect(result).toEqual(user);
  });

  it("findOneBy => should find a user by a given id and return its data", async () => {
    //arrange
    const id = "1" as UUID;
    const user = {
      id: "1" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    } as User;

    jest.spyOn(mockUserRepository, "findOneBy").mockReturnValue(user);

    //act
    const result = await service.findOneById(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
  });

  it("remove => should find a user by a given id, remove and then return Number of affected rows", async () => {
    const id = "1" as UUID;
    const user: User = {
      id: "1" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    };

    jest.spyOn(mockUserRepository, "delete").mockReturnValue(user);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.delete).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
  });

  it("update => should find a user by a given id, remove and then return Number of affected rows", async () => {
    const id = "1" as UUID;
    const updateUser: Partial<User> = { firstName: "Updated" };
    const user: User = {
      id: "1" as UUID,
      firstName: "Updated",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    };

    jest.spyOn(mockUserRepository, "update").mockReturnValue(user);

    //act
    const result = await service.update(id, updateUser);

    expect(result).toEqual(user);
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledWith(id, updateUser);
  });
});
