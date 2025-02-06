import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { createTestingModule } from "test/setup";
import { Task } from "./entities/task.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskPriority } from "./types/TaskPriority";
import { UUID } from "crypto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { BadRequestException } from "@nestjs/common";

describe("TaskService", () => {
  let service: TaskService;

  const mockTaskRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      [],
      [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    );
    service = module.get<TaskService>(TaskService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
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

    jest.spyOn(mockTaskRepository, "save").mockReturnValue(task);

    // act
    const result = await service.create(createTaskDto);

    // assert
    expect(mockTaskRepository.save).toHaveBeenCalled();
    expect(mockTaskRepository.save).toHaveBeenCalledWith(createTaskDto);

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

    //act
    const result = await service.findOneById(id);

    expect(result).toEqual(task);
    expect(mockTaskRepository.findOneBy).toHaveBeenCalled();
    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id });
  });

  it("remove => should find a task by a given id, remove and then return Number of affected rows", async () => {
    const id = "2" as UUID;
    const task = {
      id: "2" as UUID,
      name: "Chadwick",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    jest.spyOn(mockTaskRepository, "delete").mockReturnValue(task);

    //act
    const result = await service.remove(id, id);

    expect(result).toEqual(task);
    expect(mockTaskRepository.delete).toHaveBeenCalled();
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(id);
  });

  it("update => should find a user by a given id, remove and then return Number of affected rows", async () => {
    const id = "2" as UUID;
    const updateTask: UpdateTaskDto = { name: "Task name updated" };
    const task = {
      id: "2" as UUID,
      name: "Task name updated",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    jest.spyOn(mockTaskRepository, "update").mockReturnValue(task);

    //act
    const result = await service.update(id, updateTask, id);

    expect(result).toEqual(task);
    expect(mockTaskRepository.update).toHaveBeenCalled();
    expect(mockTaskRepository.update).toHaveBeenCalledWith(id, updateTask);
  });

  it("should return error when update", async () => {
    const id = "1" as UUID;
    const updateTask: UpdateTaskDto = { name: "Task name updated" };
    const task = {
      id: "2" as UUID,
      name: "Task name updated",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    jest.spyOn(mockTaskRepository, "update").mockReturnValue(task);

    //act
    await expect(service.update(id, updateTask, id)).rejects.toThrow(
      BadRequestException,
    );
  });
  it("should return error when update", async () => {
    const id = "1" as UUID;
    const updateTask: UpdateTaskDto = { name: "Task name updated" };
    const task = {
      id: "2" as UUID,
      name: "Task name updated",
      priority: TaskPriority.LOW,
      dueDate: new Date("2025-03-23T18:25:43.511Z"),
      userId: "2" as UUID,
    } as Task;

    jest.spyOn(mockTaskRepository, "delete").mockReturnValue(task);

    //act
    await expect(service.remove(id, id)).rejects.toThrow(BadRequestException);
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
  
      jest.spyOn(mockTaskRepository, "find").mockReturnValue(task);
  
      // act
      const result = await service.findAll();
      mockTaskRepository.find.mockResolvedValueOnce(task);
  
      // assert
      expect(mockTaskRepository.find).toHaveBeenCalled();
      //expect(mockTaskRepository.find).toHaveBeenCalledWith();
  
      expect(result).toEqual(task);
    });

    it("findByMe => Should fetch all the tasks", async () => {
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
  
      jest.spyOn(mockTaskRepository, "find").mockReturnValue(task);
  
      // act
      const result = await service.findByMe(id);
      mockTaskRepository.find.mockResolvedValueOnce(task);
  
      // assert
      expect(mockTaskRepository.find).toHaveBeenCalled();
      expect(mockTaskRepository.find).toHaveBeenCalledWith({ where: { user: { id } } });
  
      expect(result).toEqual(task);
    });
});
