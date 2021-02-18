import { CreateClientDto } from "src/modules/clients/create-client.dto";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { AddressEntity } from "./address.entity";

@Entity('persons')
export class PersonEntity {

    //generate and fill personentity instance
    generate(createClientDto: CreateClientDto){
        this.cui = createClientDto.cui;
        this.name1 = createClientDto.name1;
        this.name2 = createClientDto.name2;
        this.last_name1 = createClientDto.last_name1;
        this.last_name2 = createClientDto.last_name2;
        this.birth_date = createClientDto.birth_date;
        this.phone = createClientDto.phone;
        this.email = createClientDto.email;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    cui?: string;

    @Column()
    name1: string;

    @Column()
    name2?: string;

    @Column()
    last_name1: string;

    @Column()
    last_name2?: string;

    @Column({nullable: true})
    birth_date?: Date;

    @Column()
    phone?: string;

    @Column()
    email?: string;

    @Column({ default: true })
    isActive?: boolean;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;

    @OneToOne(() => AddressEntity)
    @JoinColumn()
    address: AddressEntity;


}