import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../strategy/jwt.strategy';
import { createTestingModule } from 'test/setup';
import { AccessTokenPayload } from '../types/AccessTokenPayload';
import { UUID } from 'crypto';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
      const module: TestingModule = await createTestingModule(
        [],
        [
          JwtStrategy
        ],
        [PassportModule]
      );
      jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    });

  describe('validate', () => {
    it('should return the payload for complete authorization scopes', async () => {
      const mockPayload: AccessTokenPayload = {
        userId: "1" as UUID,
        email: "test@mail.com"
      };
      const result = await jwtStrategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });
});