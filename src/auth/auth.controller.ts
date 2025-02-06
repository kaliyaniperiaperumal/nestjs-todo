import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { AuthGuard } from "@nestjs/passport";
import { RegisterRequestDTO } from "./dto/register-request.dto";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { RegisterResponseDTO } from "./dto/register-response.dto";
import { Public } from "./decorators/public.decorator";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginRequestDTO } from "./dto/login-request.dto";
@ApiTags("Authentication")
@Public()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: "User successfully logged In.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request with Invalid Username/Password.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: LoginRequestDTO,
    description: "Json structure for user object",
  })
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(
    @Body() loginBody: LoginRequestDTO
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginBody);
  }

  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: RegisterRequestDTO,
    description: "Json structure for user object",
  })
  @Post("register")
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
