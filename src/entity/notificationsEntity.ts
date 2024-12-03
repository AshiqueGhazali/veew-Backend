export interface INotification {
    id: string;
    userId: string;
    notification:string,
  }
  
export interface INotificationCreationAttributes extends Omit<INotification, "id"> {}
  