export interface ITransaction {
    id: string;
    userId:string
    transactionType:"CREDIT" | "DEBIT";
    paymentIntentId:string;
    purpose:"WALLET" | "PRICING" | "TICKET"
    amount:number;
  }
  
export interface ITransactionCreationAttributes extends Omit<ITransaction, "id"> {}
  