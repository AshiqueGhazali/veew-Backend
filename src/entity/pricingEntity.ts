export interface IPricing {
  id: string;
  title: string;
  category: "PRICING" | "SUBSCRIPTION";
  price: number;
  numberOfEvents: number;
  expireAfter?: number;
  maxParticipents: number;
  idealFor: string;
}

export interface IPricingCreationAttributes extends Omit<IPricing, "id"> {}
