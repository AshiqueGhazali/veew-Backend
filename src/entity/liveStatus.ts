export interface ILiveStatus {
    id : string;
    eventId : string;
    startTime ?: string;
    endTime ?: string
}

export interface IILiveStatusCreationAttributes extends Omit<ILiveStatus, "id">{}