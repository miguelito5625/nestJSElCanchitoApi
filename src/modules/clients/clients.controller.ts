import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './create-client.dto';
import { Response } from "express";

@Controller('clients')
export class ClientsController {

    constructor(
        private clientService: ClientsService
    ){}

    @Post()
    async createClient(@Body() createClientDto: CreateClientDto, @Res() res: Response){
        const client = await this.clientService.createOne(createClientDto);
        res.status(HttpStatus.CREATED).json({
            message: 'client created',
            client
        });
    }

    @Get()
    async listAllClientWhitPersonRelation(@Res() res: Response){
        const clients = await this.clientService.findAllWithPersonRelation();
        res.status(HttpStatus.OK).json({
            message: 'all clients',
            status: 'ok',
            clients
        });
    }

    @Get(':id')
    async getOneClient(@Param('id') clientId: number, @Res() res: Response){
        const client = await this.clientService.findOne(clientId);
        let message, status = '';
        if (client) {
            message = 'client found';
            status = 'ok';
            Logger.log(message);
            console.log(client);
        } else {
            message = 'no client found';
            status = 'error'
            Logger.log(message);
        }

        res.status(HttpStatus.OK).json({
            message,
            status,
            client
        });
    }

    @Put()
    async updateClient(@Body() createClientDto: CreateClientDto, @Res() res: Response){
        const client = await this.clientService.update(createClientDto);
        if (!client) {
           return res.status(HttpStatus.NOT_FOUND).json({
              message: 'client not found',
              status: 'error'
            });
          }
        return res.status(HttpStatus.OK).json({
            message: 'client update',
            client
        });
    }

    @Patch(':id')
    async switchActive(@Param('id') personId, @Res() res: Response){
        const person = await this.clientService.switchActive(personId);
        if (!person) {
           return res.status(HttpStatus.NOT_FOUND).json({
              message: 'client not found',
              status: 'error'
            });
          }
        return res.status(HttpStatus.OK).json({
            message: 'client update',
            person
        });
    }

}
