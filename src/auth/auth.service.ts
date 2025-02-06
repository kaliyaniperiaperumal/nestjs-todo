import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { RegisterRequestDTO } from "./dto/register-request.dto";
import { AccessToken } from "./types/AccessToken";
import { User } from "src/user/entities/user.entity";
import { LoginRequestDTO } from "./dto/login-request.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password incorrect");
    }
    return user;
  }
  async login(loginDetails: LoginRequestDTO): Promise<AccessToken> {
    let access_token;
    const existingUser = await this.userService.findOneByEmail(loginDetails.email);
    console.log("ExistingUser", existingUser);
    if(existingUser){
      const isMatchPassword: boolean = await bcrypt.compare(loginDetails.password, existingUser.password);
      if(isMatchPassword) {
        const payload = { email: existingUser.email, id: existingUser.id };
        access_token = this.jwtService.sign(payload);
        console.log("New Token", access_token);
        await this.userService.update(existingUser.id, {
          accessToken: access_token,
        });
        return { access_token };
      } else {
        throw new BadRequestException('Invalid credentials')
      }
      // bcrypt.compare(loginDetails.password, existingUser.password, (err, data) => {
      //   if(err) throw new BadRequestException(err);
      //   if(data) {
      //     const payload = { email: existingUser.email, id: existingUser.id };
      //     access_token = this.jwtService.sign(payload);
      //     console.log("New Token", access_token);
      //   } else {
      //     throw new BadRequestException('Invalid credentials')
      //   }
      // })
      // this.userService.update(existingUser.id, {
      //   accessToken: access_token,
      // });
      // return { access_token };
    }
  }
  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create({ ...user, password: hashPassword});
    const payload = { email: newUser.email, id: newUser.id };
    const access_token = this.jwtService.sign(payload);
    await this.userService.update(newUser.id, {
      accessToken: access_token,
    });
    return { access_token};
  }
}
