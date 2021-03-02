export class CreateProductDto {
    id?:number;
    name: string;
    description: string;
    brandId: number;
    supplierId: number;
    stock: number;
    unit: string;
    purchase_price: number;
    sale_price: number;
  }