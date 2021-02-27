import { CreateClientDto } from "src/modules/clients/create-client.dto";
import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from "typeorm";

@Entity('addresses')
export class AddressEntity {

    //generate and fill addressentity instance
    generate(createClientDto: CreateClientDto){
        this.country = createClientDto.country;
        this.departament = createClientDto.departament;
        this.municipality = createClientDto.municipality;
        this.street = createClientDto.street;
        this.reference = createClientDto.reference;
        this.zip_code = createClientDto.zip_code;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    departament: string;

    @Column()
    municipality: string;

    @Column()
    street: string;

    @Column()
    reference: string;

    @Column()
    zip_code: string;

}