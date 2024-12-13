export interface IEventReport {
    id: string;
    reporterId:string;
    reportedEventId:string;
    reason:string
  }
  
  export interface IEventReportCreationAttributes extends Omit<IEventReport, "id"> {}
  