import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    constructor(
        private userService: UsersService
    ) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const user = await this.userService.createOne(createUserDto);
        res.status(HttpStatus.CREATED).json({
            message: 'user created',
            status: 'ok',
            user
        });
    }

    @Get()
    async listAllUserWhitPersonRelation(@Res() res: Response) {
        const users = await this.userService.findAllWithPersonRelation();
        res.status(HttpStatus.OK).json({
            message: 'all users',
            status: 'ok',
            total_users: users.length,
            users
        });
    }

    @Get(':id')
    async getOneUser(@Param('id') userId: number, @Res() res: Response) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'user not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'user found',
            status: 'ok',
            user
        });
    }

    @Put()
    async updateUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const user = await this.userService.update(createUserDto);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'user not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'user update',
            status: 'ok',
            user
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') userId, @Res() res: Response) {
        const user = await this.userService.switchActive(userId);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'user not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'user update',
            status: 'ok',
            user
        });
    }
    
}
