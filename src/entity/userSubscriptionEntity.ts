export interface IUserSubscription {
    id:string,
    userId:string,
    planId:string,
    paymentIntentId:string,
    startDate:Date,
    expireDate?:Date,
    numberOfEventsUsed:number,
    maxNumberOfEvents?:number,
}

export interface IUserSubscriptionCreationAttributes extends Omit<IUserSubscription,'id'>{}