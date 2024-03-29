import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {LoginDto} from "./dto/login.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() loginDto: LoginDto){
    return this.usersService.signin(loginDto)
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('activate/:id')
  activateAdmin(@Param('id') id: string){
    return this.usersService.activateAdmin(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
