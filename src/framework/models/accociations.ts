// models/associations.ts
import Pricing from './PricingModel';
import UserSubscription from './UserSubscriptionModel';
import User from './UserModel';
import Events from './EventModel';

Pricing.hasMany(UserSubscription, {
  foreignKey: "planId",
  as: "plans"
});

UserSubscription.belongsTo(Pricing, {
  foreignKey: "planId",
  as: "pricing"
});

UserSubscription.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

User.hasMany(UserSubscription, {
  foreignKey: "userId", 
  as: "subscriptions"
});

User.hasMany(Events,{
  foreignKey: "hostsId", 
  as: "events"
})

Events.belongsTo(User,{
  foreignKey:'hostsId',
  as:'user'
})
export { Pricing, UserSubscription, User };
