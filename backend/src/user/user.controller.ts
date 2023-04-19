import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get()
	findAll() {
		return "user";
		// res.redirect(301, 'http://localhost/test');

		// return;
		// return this.userService.findAll();
	}

	//   @Get(':code')
	//   findOne(@Param('code') id: string) {
	//     // return this.userService.findOne(+id)S;
	//   }






	//   @Patch(':id')
	//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	//     // return this.userService.update(+id, updateUserDto);
	//   }

	//   @Delete(':id')
	//   remove(@Param('id') id: string) {
	//     // return this.userService.remove(+id);
	//   }
}
