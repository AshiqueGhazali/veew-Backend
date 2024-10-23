import Stripe from "stripe";

export interface IStripe{
    makePayment(totalAmount:number,planId:string|null,eventId:string|null):Promise<string>
    getPaymentIntentFromSession(paymentIntentId: string): Promise<Stripe.PaymentIntent | null>;
}