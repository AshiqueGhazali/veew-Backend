// models/associations.ts
import Pricing from './PricingModel';
import UserSubscription from './UserSubscriptionModel';
import User from './UserModel';
import Events from './EventModel';
import Wallet from './WalletModel';
import Transaction from './TransactionModel';
import Ticket from './TicketModel';

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


User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'walletUser' });

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'transactionUser' });

User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'ticketOwner' });

Events.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
Ticket.belongsTo(Events, { foreignKey: 'eventId', as: 'eventDetails' });

export { Pricing, UserSubscription, User };
