import { Reflector } from '@nestjs/core';
import { JwtGuard } from '../guards/jwt.guards';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createTestingModule } from 'test/setup';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../strategy/jwt.strategy';

describe('JwtAuthGuard', () => {
  let guard: JwtGuard;
  let reflector: Reflector;

  // beforeEach(async () => {
  //   const module = await Test.createTestingModule({
  //     providers: [
  //       JwtGuard
  //     ],
  //   }).compile();

  //   guard = module.get<JwtGuard>(JwtGuard);
  //   reflector = new Reflector();
  // });

  beforeEach(async () => {
        const module: TestingModule = await createTestingModule(
          [],
          [
            JwtGuard, JwtStrategy
          ],
        );
        guard = module.get<JwtGuard>(JwtGuard);
    reflector = new Reflector();
      });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow public routes', async () => {
    // Arrange
    const context = createMock<ExecutionContext>();
    reflector.getAllAndOverride = jest.fn().mockReturnValue(true);

    expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
  });
});
