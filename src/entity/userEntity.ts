
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    isBlock?:boolean
  }
  
  export interface IUserCreationAttributes extends Omit<IUser, 'id'> {}