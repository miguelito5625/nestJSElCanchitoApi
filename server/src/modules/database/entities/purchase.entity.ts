import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, Column, ManyToMany, JoinTable} from "typeorm";
import { PersonEntity } from "./person.entity";
import { ProductEntity } from "./product.entity";
import { PurchaseProductsProductEntity } from "./purchase-products-product.entity";

@Entity('purchases')
export class PurchaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    total: number;

    @Column()
    discount: number;

    @Column({ default: true })
    isActive?: boolean;

    @OneToMany(() => PurchaseProductsProductEntity, productsInPurchase => productsInPurchase.purchase)
    productsInPurchase?: PurchaseProductsProductEntity[];

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;



}