import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtGuard } from "./auth/guards/jwt.guards";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle("Practice Assignment")
    .setDescription("Practice assignement for Backend with NestJs")
    .setVersion("1.0")
    .addServer("http://localhost:3100", "Local Server")
    .addTag("Test Page")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
