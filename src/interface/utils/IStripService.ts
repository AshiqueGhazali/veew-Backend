import Stripe from "stripe";
export const paymentType = {
    SUBSCRIPTION : 'SUBSCRIPTION',
    WALLET : 'WALLET',
    TICKETBOOKING : 'TICKERBOOKING'
} as const

export type paymentTypes =  'SUBSCRIPTION' | 'WALLET' | 'TICKERBOOKING'
export interface IStripe{
    makePayment(totalAmount:number,planId:string|null,eventId:string|null, pymentType:paymentTypes):Promise<string>
    getPaymentIntentFromSession(paymentIntentId: string): Promise<Stripe.PaymentIntent | null>;
}