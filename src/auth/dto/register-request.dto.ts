import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

const passwordRegEx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export class RegisterRequestDTO {
  @ApiProperty({
    example: "Test",
    required: true,
  })
  @IsString()
  @MinLength(2, { message: "Name must have atleast 2 characters." })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "User",
    required: true,
  })
  @IsString()
  @MinLength(2, { message: "Name must have atleast 2 characters." })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "test@test.com",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "XXXXXXXXXX",
    required: true,
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;
}
