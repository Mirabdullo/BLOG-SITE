import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import {LoginDto} from "./dto/login.dto";
import {TokensService} from "../tokens/tokens.service";

@Injectable()
export class UsersService {
  constructor(
      private prismaService: PrismaService,
      private tokenService: TokensService
  ) {}
  async signup(createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto)
      const user = await this.prismaService.user.findUnique({where: {email: createUserDto.email}})
      if (user) {
        throw new HttpException(
            'This user already exists',
            HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = bcrypt.hash(createUserDto.password, 7)
      const newuser = await this.prismaService.user.create({
        data: {
          password: hashedPassword,
          ...createUserDto
        }
      })

      const payload = {
        id: newuser.id,
        email: newuser.email,
        is_admin: newuser.is_admin
      }
      const token = await this.tokenService.getTokens(payload)
      console.log(token)
      return token
    } catch (error) {
      console.log(error);
      if (!error.status) {
        throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async signin(loginDto: LoginDto){
    try {
      const user = await this.prismaService.user.findUnique({where: {email: loginDto.email}})

      if(!user) throw new HttpException('Email not found', HttpStatus.BAD_REQUEST)

      const passwordMatches = bcrypt.compare(loginDto.password, user.password)
      if(!passwordMatches) throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST)

      const payload = {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin
      }
      const token = await this.tokenService.getTokens(payload)
      console.log(token)
      return {
        access_token: token
      }
    }catch (e) {
      console.log(e)
    if(!e.status){
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    throw new HttpException(e.message, e.status)
    }
  }


  async activateAdmin(id: number){
    try {
      const user = await this.prismaService.user.findUnique({where: {id}})
      if(!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND)

      await this.prismaService.user.update({where: {id}, data: {is_admin: true}})
      return {
        status: 200,
        message: "Admin activated"
      }
    }catch (error) {
      console.log(error);
      if (!error.status) {
        throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, error.status);
    }
  }


  async findAll() {
    try {
      return await this.prismaService.user.findMany()
    } catch (error) {
      console.log(error);
      if (!error.status) {
        throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({where: {id: id}, include: {Post: true}})
      if(!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND)

      return user
    } catch (error) {
      console.log(error);
      if (!error.status) {
        throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.findUnique({where: {id: id}})
      console.log(user)
      if(!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

      const checkemail = await this.prismaService.user.findUnique({where: {email: updateUserDto.email}})
      if(checkemail) throw new BadRequestException('This email already exists')
      await this.prismaService.user.update( {where: {email: user.email}, data: updateUserDto})
      return {
        status: 200,
        message: 'Data updated!'
      }
    } catch (error) {
      console.log(error);
      if (!error.status) {
        throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, error.status);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

}
