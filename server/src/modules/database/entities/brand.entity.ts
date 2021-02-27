import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { SupplierEntity } from "./supplier.entity";

@Entity('brands')
export class BrandEntity {

    //generate and fill BrandEntity instance
    generate(product: any){
        this.name = product.name;
        this.description = product.description?product.description:'';
    }

    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column()
    name: string;

    @Column({ default:'' })
    description: string;

    @Column({ default: true })
    isActive?: boolean;

    @CreateDateColumn({type: "timestamp"})
    createdAt?: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt?: Date;

    @OneToMany(() => ProductEntity, product => product.brand)
    products: ProductEntity[];

}