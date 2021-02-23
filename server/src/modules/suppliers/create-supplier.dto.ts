export class CreateSupplierDto {
    id?: number;
    cui: string;
    name1: string;
    name2: string;
    last_name1: string;
    last_name2: string;
    birth_date: Date;
    phone: string;
    email: string;
    country: string;
    departament: string;
    municipality: string;
    street: string;
    reference: string;
    zip_code: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }