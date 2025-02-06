import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

export const createTestingModule = async (
  imports: any[],
  providers: any[],
  otherImports: any[] = [],
) => {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env.test",
      }),
      JwtModule.register({
        secretOrPrivateKey: "Secret key",
      }),
      ...otherImports,
    ],
    controllers: [...imports],
    providers: [...providers],
  }).compile();
};
