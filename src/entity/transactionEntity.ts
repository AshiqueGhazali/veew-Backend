export enum transactionType {
  CREDIT="CREDIT",
  DEBIT= "DEBIT"
}

export enum transactionPurpose {
  WALLET = "WALLET",
  PRICING = "PRICING",
  TICKET = "TICKET"
}

export enum paymentMethod {
  WALLET = "WALLET",
  ONLINE = "ONLINE"
}

export interface ITransaction {
    id: string;
    userId:string
    transactionType: transactionType;
    paymentIntentId?:string;
    paymentMethod:paymentMethod;
    purpose:transactionPurpose;
    amount:number;
    createdAt?: Date;
    updatedAt?:Date
  }


  
export interface ITransactionCreationAttributes extends Omit<ITransaction, "id"> {}
  