import Stripe from "stripe";
import { IStripe, paymentTypes } from "../../interface/utils/IStripService";


export default class StripePayment implements IStripe {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    }

    async makePayment(totalPrice: number, planId: string | null, eventId: string | null ,  pymentType:paymentTypes): Promise<string> {
        console.log("the price is :", totalPrice);

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "test"
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1
            }
        ];

        let query = '';
        if (planId) {
            query = `plan_id=${planId}`;
        } else if (eventId) {
            query = `event_id=${eventId}`;
        }

        const session = await this.stripe.checkout.sessions.create({
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&payment_for=${pymentType}&${query}`,
            cancel_url: 'http://localhost:5173/failure',
            line_items: line_items,
            mode: 'payment',
            billing_address_collection: 'required'
        });

        return session.id;
    }

    async getPaymentIntentFromSession(sessionId: string): Promise<Stripe.PaymentIntent | null> {
        try {
            const session: Stripe.Checkout.Session = await this.stripe.checkout.sessions.retrieve(sessionId);

            const paymentIntentId: string | null = session.payment_intent as string | null;

            if (paymentIntentId) {
                const paymentIntent: Stripe.PaymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
                return paymentIntent;
            } else {
                console.log("No payment intent found in the session.");
                return null;
            }
        } catch (error) {
            console.error("Error retrieving payment intent:", error);
            throw error;
        }
    }
}
