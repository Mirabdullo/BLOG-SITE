import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
