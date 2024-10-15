export interface IPricing {
    id: string;
    title:string;
    category:'PRICING' | 'SUBSCRIPTION';
    price:number;
    expiredAfter:number;
    NumberOfEvents:number;
    description:string;
  }
  
  export interface IPricingCreationAttributes extends Omit<IPricing, 'id'> {}