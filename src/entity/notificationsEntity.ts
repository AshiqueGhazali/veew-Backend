export interface INotification {
    id: string;
    userId: string;
    notificationHead:string
    notification:string,
  }
  
export interface INotificationCreationAttributes extends Omit<INotification, "id"> {}
  