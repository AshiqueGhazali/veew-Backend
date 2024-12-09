// models/associations.ts
import Pricing from "./PricingModel";
import UserSubscription from "./UserSubscriptionModel";
import User from "./UserModel";
import Events from "./EventModel";
import Wallet from "./WalletModel";
import Transaction from "./TransactionModel";
import Ticket from "./TicketModel";
import Notification from "./NotificationModel";
import LiveStatus from "./LiveStatusModel";
import Likes from "./LikesModel";
import Comments from "./CommentsModel";

Pricing.hasMany(UserSubscription, { foreignKey: "planId", as: "plans" });

UserSubscription.belongsTo(Pricing, { foreignKey: "planId", as: "pricing" });

UserSubscription.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(UserSubscription, { foreignKey: "userId", as: "subscriptions" });

User.hasMany(Events, { foreignKey: "hostsId", as: "events" });

Events.belongsTo(User, { foreignKey: "hostsId", as: "user" });

User.hasOne(Wallet, { foreignKey: "userId", as: "wallet" });
Wallet.belongsTo(User, { foreignKey: "userId", as: "walletUser" });

User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "transactionUser" });

User.hasMany(Ticket, { foreignKey: "userId", as: "tickets" });
Ticket.belongsTo(User, { foreignKey: "userId", as: "ticketOwner" });

Events.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
Ticket.belongsTo(Events, { foreignKey: "eventId", as: "eventDetails" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "userNotifications" });

Events.hasOne(LiveStatus, { foreignKey: "eventId", as: "eventStatus" });
LiveStatus.belongsTo(Events, { foreignKey: "eventId", as: "liveEvent" });

Events.hasMany(Likes, { foreignKey: "eventId", as: "eventLikes" });
Likes.belongsTo(Events, { foreignKey: "eventId", as: "likedEvent" });

User.hasMany(Likes, { foreignKey: "userId", as: "userLikes" });
Likes.belongsTo(User, { foreignKey: "userId", as: "likedBy" });

Events.hasMany(Comments, { foreignKey: "eventId", as: "eventComments" });
Comments.belongsTo(Events, { foreignKey: "eventId", as: "CommentedEvent" });

User.hasMany(Comments, { foreignKey: "userId", as: "userComments" });
Comments.belongsTo(User, { foreignKey: "userId", as: "CommentedBy" });

Comments.hasMany(Comments, { foreignKey: 'parentId', as: 'replies' });
Comments.belongsTo(Comments, { foreignKey: 'parentId', as: 'parentComment' });

export { Pricing, UserSubscription, User };
