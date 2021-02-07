export class CreateClientDto {
    id?: number;
    cui?: string;
    name1: string;
    name2?: string;
    last_name1: string;
    last_name2?: string;
    birth_date?: Date;
    phone?: string;
    email?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }