import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [PrismaModule, JwtModule, MulterModule.register({dest: './uploads'})],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
