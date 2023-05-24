import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('PRIVATE_KEY'),
        signOptions: {
          expiresIn: config.get<string>('EXPIRES_TIME'),
        },
      })
    }),
      PrismaModule
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
