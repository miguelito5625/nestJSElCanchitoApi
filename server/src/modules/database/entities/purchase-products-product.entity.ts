import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, Column, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { PersonEntity } from "./person.entity";
import { ProductEntity } from "./product.entity";
import { PurchaseEntity } from "./purchase.entity";

@Entity('purchase_products_product')
export class PurchaseProductsProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productQuantity: number;

    @ManyToOne(() => ProductEntity, product => product.purchasesInProducts)
    product: ProductEntity;

    @ManyToOne(() => PurchaseEntity, purchase => purchase.productsInPurchase)
    purchase: PurchaseEntity;

}