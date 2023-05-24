import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import * as process from "process";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    UsersModule,
    PrismaModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
