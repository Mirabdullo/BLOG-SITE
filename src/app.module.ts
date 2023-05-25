import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import * as process from "process";
import {ServeStaticModule} from "@nestjs/serve-static";
import { resolve } from 'path';
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
      MulterModule.register({
        dest: './uploads'
      }),
      ServeStaticModule.forRoot({
        rootPath: resolve(__dirname, '..', 'uploads')
      }),
    UsersModule,
    PrismaModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
