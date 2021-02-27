import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany} from "typeorm";
import { PersonEntity } from "./person.entity";
import { ProductEntity } from "./product.entity";

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

    @OneToMany(() => ProductEntity, product => product.supplier)
    products: ProductEntity[];

}