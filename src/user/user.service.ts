import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { User } from "./entities/user.entity";
import { UUID } from "crypto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(user: User) {
    return this.userRepository.save(user);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: UUID) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: UUID, userInformation: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update(id, userInformation);
  }

  remove(id: UUID) {
    return this.userRepository.delete(id);
  }
}
