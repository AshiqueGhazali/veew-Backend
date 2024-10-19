export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  age?: number;
  gender?: string;
  image?: string;
  isBlock?: boolean;
  currentSubscriptionId?:string
}

export interface IUserCreationAttributes extends Omit<IUser, "id"> {}
