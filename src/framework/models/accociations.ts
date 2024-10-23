// models/associations.ts
import Pricing from './PricingModel';
import UserSubscription from './UserSubscriptionModel';
import User from './UserModel';

// Define associations
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
// Export models if needed elsewhere

export { Pricing, UserSubscription, User };
