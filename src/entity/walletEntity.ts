export interface IWallet {
  id: string;
  userId: string;
  balanceAmount: number;
}

export interface IWalletCreationAttributes extends Omit<IWallet, "id"> {}
