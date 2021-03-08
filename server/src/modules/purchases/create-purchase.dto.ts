export class CreatePurchaseDto {
    id?: number;
    
    description: string;
    discount: number;
    subTotal: number;
    total: number;
    purchaseProducts: PurchaseProduct[];
    
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }


  class PurchaseProduct{
    productId: number;
    quantity: number;
  }