import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Next,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtPayload } from 'src/auth/interfaces';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    return await this.userService.getAllUsers();
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return await this.userService.findProfileByUsername(username);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor(
      'file', // Nombre input formulario
      {
        // Donde se va a guardar
        storage: diskStorage({
          destination: './uploads',
          filename: function (req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname);
          },
        }),
      },
    ),
  )
  async update(
    @Request() { user }: { user: JwtPayload },
    @Body() userDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateUser(user.login, userDto, file);
  }
}
