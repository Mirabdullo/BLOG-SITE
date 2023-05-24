import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image: string

}
