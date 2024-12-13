export interface IUserReport {
    id: string;
    reporterId:string;
    reportedUserId:string;
    reason:string
  }
  
  export interface IUserReportCreationAttributes extends Omit<IUserReport, "id"> {}
  