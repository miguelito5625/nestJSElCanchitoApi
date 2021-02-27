import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm";
import { PersonEntity } from "./person.entity";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PersonEntity)
    @JoinColumn()
    person: PersonEntity;

}