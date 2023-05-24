import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {PrismaService} from "../prisma/prisma.service";
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";

@Injectable()
export class PostsService {
  constructor(
      private prismaService: PrismaService,
      private readonly jwtService: JwtService
  ) {
  }
  async create(createPostDto: CreatePostDto, req: Request) {
    try {
      const token = req.headers.authorization
      if(!token) throw new UnauthorizedException('Not found token')

      const value = token.split(' ')[1]
      const user = this.jwtService.verify(value,{
        secret: process.env.ACCESS_TOKEN_KEY
      })

      await this.prismaService.post.create({
        data: {
          userId: user.id,
          ...createPostDto
        }
      })

      return {
        status: 201,
        message: 'Post created'
      }
    }catch (error) {
      console.log(error)
      if(!error.status) throw new InternalServerErrorException(error.message)
      throw new HttpException(error.status, error.message)
    }
  }

  async findAll() {
    try {
      const posts = await this.prismaService.post.findMany()
      return posts
    } catch (error) {
      console.log(error)
      if(!error.status) throw new InternalServerErrorException(error.message)
      throw new HttpException(error.message, error.status)
    }
  }

  async findOne(id: number) {
    try {
      const post = await this.prismaService.post.findUnique({where: {id}})
      if(!post) throw new BadRequestException('Invalid id')

      return post
    } catch (error) {
      console.log(error)
      if(!error.status) throw new InternalServerErrorException(error.message)

      throw new HttpException(error.message, error.status)
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.prismaService.post.findUnique({where: {id}})
      if(!post) throw new BadRequestException('Invalid id')

      if(updatePostDto.image){

      }
    } catch (error) {
      console.log(error)
      if(!error.status) throw new InternalServerErrorException(error.message)

      throw new HttpException(error.message, error.status)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
