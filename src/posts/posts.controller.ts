import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request} from "express";
import {FileInterceptor} from "@nestjs/platform-express";
import { extname } from 'path';
import {diskStorage} from "multer";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        return callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createPostDto: CreatePostDto,
         @Req() req: Request,
         @UploadedFile() image?: Express.Multer.File,
  ) {
    if(image) {
      createPostDto.image = image.filename
    }
    return this.postsService.create(createPostDto, req);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
