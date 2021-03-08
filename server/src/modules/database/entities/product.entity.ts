import { CreateProductDto } from "src/modules/products/create-product.dto";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { BrandEntity } from "./brand.entity";
import { PurchaseProductsProductEntity } from "./purchase-products-product.entity";
import { SupplierEntity } from "./supplier.entity";

@Entity('products')
export class ProductEntity {

    //generate and fill ProductEntity instance
    generate(product: CreateProductDto, supplier: SupplierEntity, brand: BrandEntity){
        this.name = product.name;
        this.description = product.description?product.description:'';
        this.stock = product.stock;
        this.unit = product.unit;
        this.purchase_price = product.purchase_price;
        this.sale_price = product.sale_price;
        this.supplier =  supplier?supplier:null;
        this.brand = brand?brand:null;
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

    @OneToMany(() => PurchaseProductsProductEntity, purchasesInProducts => purchasesInProducts.product)
    purchasesInProducts?: PurchaseProductsProductEntity[];

    @ManyToOne(() => SupplierEntity, supplier => supplier.products, { nullable: true })
    supplier: SupplierEntity;

    @ManyToOne(() => BrandEntity, brand => brand.products, { nullable:true })
    brand: BrandEntity;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;

    
}