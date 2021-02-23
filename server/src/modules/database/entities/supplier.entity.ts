import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm";
import { PersonEntity } from "./person.entity";

@Entity('suppliers')
export class SupplierEntity {

    @PrimaryGeneratedColumn()
    id: number;

    // @CreateDateColumn({type: "timestamp"})
    // createdAt: Date;

    // @UpdateDateColumn({type: "timestamp"})
    // updatedAt: Date;

    @OneToOne(() => PersonEntity)
    @JoinColumn()
    person: PersonEntity;

}