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
import UserReport from "./UserReportModel";
import EventReport from "./EventReportModel";
import Conversation from "./ConversationModel";
import Message from "./MessageModel";

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

User.hasMany(UserReport, { foreignKey: "reporterId", as: "reportsMade" });
User.hasMany(UserReport, { foreignKey: "reportedUserId", as: "reportsReceived" });

UserReport.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });
UserReport.belongsTo(User, { foreignKey: "reportedUserId", as: "reportedUser" });


User.hasMany(User, { foreignKey: "reporterId", as: "reportCreatedBy" });
Events.hasMany(EventReport, { foreignKey: "reportedEventId", as: "reportsReceived" });

EventReport.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });
EventReport.belongsTo(Events, { foreignKey: "reportedEventId", as: "reportedEvent" });

// User.hasMany(Message, {foreignKey:"senderId", as:"sendedMessages"})
// User.hasMany(Message, {foreignKey:" receiverId", as:"recievedMessages"})

// Message.belongsTo(User, {foreignKey:"senderId", as:"sendBy"})
// Message.belongsTo(User, {foreignKey:" receiverId", as:"receiver"})
User.hasMany(Conversation,{foreignKey:"firstUserId", as:"user1Conversation"})
User.hasMany(Conversation,{foreignKey:"secondUserId", as:"user2Conversation"})

Conversation.belongsTo(User,{foreignKey:"firstUserId", as:"firstUserInConversation"})
Conversation.belongsTo(User,{foreignKey:"secondUserId", as:"secondUserInConversation"})

Conversation.hasMany(Message, {foreignKey:"conversationId", as:"messages"})
User.hasMany(Message,{foreignKey:"senderId", as:"sendedMessage"})
User.hasMany(Message, {foreignKey:"receiverId", as:"receivedMessage"})

Message.belongsTo(Conversation, {foreignKey:"conversationId", as:"conversation"})
Message.belongsTo(User,{foreignKey:"senderId", as:"sendBy"})
Message.belongsTo(User, {foreignKey:"receiverId", as:"receivedTo"})

export { Pricing, UserSubscription, User };
