import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './create-client.dto';
import { Response } from "express";

@Controller('clients')
export class ClientsController {

    constructor(
        private clientService: ClientsService
    ) { }

    @Post()
    async createClient(@Body() createClientDto: CreateClientDto, @Res() res: Response) {
        const client = await this.clientService.createOne(createClientDto);
        res.status(HttpStatus.CREATED).json({
            message: 'client created',
            status: 'ok',
            client
        });
    }

    @Get()
    async listAllClientWhitPersonRelation(@Res() res: Response) {
        const clients = await this.clientService.findAllWithPersonRelation();
        res.status(HttpStatus.OK).json({
            message: 'all clients',
            status: 'ok',
            clients
        });
    }

    @Get(':id')
    async getOneClient(@Param('id') clientId: number, @Res() res: Response) {
        const client = await this.clientService.findOne(clientId);
        if (!client) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'client not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'client found',
            status: 'ok',
            client
        });
    }

    @Put()
    async updateClient(@Body() createClientDto: CreateClientDto, @Res() res: Response) {
        const client = await this.clientService.update(createClientDto);
        if (!client) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'client not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'client update',
            status: 'ok',
            client
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') clientId, @Res() res: Response) {
        const client = await this.clientService.switchActive(clientId);
        if (!client) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'client not found',
                status: 'error'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: 'client update',
            status: 'ok',
            client
        });
    }

}
