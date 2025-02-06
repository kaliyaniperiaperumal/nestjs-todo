import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { createTestingModule } from "test/setup";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { TaskPriority } from "./types/TaskPriority";
import { UUID } from "crypto";
import { Task } from "./entities/task.entity";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { User } from "src/user/entities/user.entity";

describe("TaskController", () => {
  let controller: TaskController;

  const mockTaskRepository = {
    create: jest.fn(),
    findByMe: jest.fn(),
    findOneById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    save: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      [TaskController],
      [
        TaskService,
        UserService,
        {
          provide: TaskService,
          useValue: mockTaskRepository,
        },
        {
          provide: UserService,
          useValue: mockUserRepository,
        },
      ],
    );
    controller = module.get<TaskController>(TaskController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("create => Should create a new task and return its data", async () => {
    // arrange
    const createTaskDto = {
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
    } as CreateTaskDTO;

    const task = {
      id: "1" as UUID,
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    const user = {
      id: "1" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    } as User;

    jest.spyOn(mockTaskRepository, "save").mockReturnValue(task);
    jest.spyOn(mockUserRepository, "findOneById").mockReturnValue(user);
    jest.spyOn(mockTaskRepository, "create").mockReturnValue(task);

    // act
    const result = await controller.create(createTaskDto, {
      user: { id: "1" as UUID },
    });
    mockTaskRepository.save.mockResolvedValueOnce(createTaskDto);

    // assert
    expect(mockTaskRepository.create).toHaveBeenCalled();
    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      ...createTaskDto,
      user,
    });

    expect(result).toEqual(task);
  });

  it("findByMe => Should fetch all the tasks under logged in user", async () => {
    // arrange
    const id = "2" as UUID;
    const createTaskDto = {
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
    } as CreateTaskDTO;

    const task = {
      id: "1" as UUID,
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    const user = {
      id: "2" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    } as User;

    jest.spyOn(mockTaskRepository, "find").mockReturnValue(task);
    jest.spyOn(mockUserRepository, "findOneById").mockReturnValue(user);
    jest.spyOn(mockTaskRepository, "findByMe").mockReturnValue(task);

    // act
    const result = await controller.findByMe({ user: { id: "2" as UUID } });
    mockTaskRepository.find.mockResolvedValueOnce(task);

    // assert
    expect(mockTaskRepository.findByMe).toHaveBeenCalled();
    expect(mockTaskRepository.findByMe).toHaveBeenCalledWith(id);

    expect(result).toEqual(task);
  });

  it("find All => Should fetch all the tasks", async () => {
    // arrange
    const id = "2" as UUID;
    const createTaskDto = {
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
    } as CreateTaskDTO;

    const task = {
      id: "1" as UUID,
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    const user = {
      id: "2" as UUID,
      firstName: "Chadwick",
      lastName: "Boseman",
      email: "chadwickboseman@email.com",
      password: "Test@1234",
    } as User;

    jest.spyOn(mockTaskRepository, "find").mockReturnValue(task);
    jest.spyOn(mockTaskRepository, "findAll").mockReturnValue(task);

    // act
    const result = await controller.findAll();
    mockTaskRepository.find.mockResolvedValueOnce(task);

    // assert
    expect(mockTaskRepository.findAll).toHaveBeenCalled();
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith();

    expect(result).toEqual(task);
  });

  it("findOneBy => should find a task by a given id and return its data", async () => {
    //arrange
    const id = "1" as UUID;
    const task = {
      id: "1" as UUID,
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    jest.spyOn(mockTaskRepository, "findOneBy").mockReturnValue(task);
    jest.spyOn(mockTaskRepository, "findOneById").mockReturnValue(task);

    //act
    const result = await controller.findOne(id);

    expect(result).toEqual(task);
    expect(mockTaskRepository.findOneById).toHaveBeenCalled();
    expect(mockTaskRepository.findOneById).toHaveBeenCalledWith(id);
  });
});
