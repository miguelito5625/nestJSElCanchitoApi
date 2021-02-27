import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { BrandEntity } from "./brand.entity";
import { SupplierEntity } from "./supplier.entity";

@Entity('products')
export class ProductEntity {

    //generate and fill ProductEntity instance
    generate(product: any){
        this.name = product.name;
        this.description = product.description?product.description:'';
        this.stock = product.stock;
        this.unit = product.unit;
        this.purchase_price = product.purchase_price;
        this.sale_price = product.sale_price;
    }

    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column()
    name: string;

    @Column({nullable:true})
    description: string;

    @Column({nullable:true})
    stock: number;

    @Column()
    unit: string;

    @Column()
    purchase_price: number;

    @Column()
    sale_price: number;

    @Column({ default: true })
    isActive?: boolean;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;

    @ManyToOne(() => SupplierEntity, supplier => supplier.products)
    supplier: SupplierEntity;

    @ManyToOne(() => BrandEntity, brand => brand.products)
    brand: BrandEntity;
}