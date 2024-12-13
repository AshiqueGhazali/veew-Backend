export interface ILiveStatus {
    id : string;
    eventId : string;
    startTime ?: string;
    endTime ?: string;
    isApproved?:boolean;
    approvedAmount?:number
}

export interface IILiveStatusCreationAttributes extends Omit<ILiveStatus, "id">{}