import { CreatePurchaseDto } from "src/modules/purchases/create-purchase.dto";
import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, Column, ManyToMany, JoinTable} from "typeorm";
import { PersonEntity } from "./person.entity";
import { ProductEntity } from "./product.entity";
import { PurchaseProductsProductEntity } from "./purchase-products-product.entity";

@Entity('purchases')
export class PurchaseEntity {

    //generate and fill purchaseentity instance
    generate(createClientDto: CreatePurchaseDto){
        this.description = createClientDto.description;
        this.discount = createClientDto.discount;
        this.subTotal = createClientDto.subTotal;
        this.total = createClientDto.total;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    discount: number;

    @Column()
    subTotal: number;

    @Column()
    total: number;

    @Column({ default: true })
    isActive?: boolean;

    @OneToMany(() => PurchaseProductsProductEntity, productsInPurchase => productsInPurchase.purchase)
    productsInPurchase?: PurchaseProductsProductEntity[];

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;



}