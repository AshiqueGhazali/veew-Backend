export interface ILikes {
    id : string;
    eventId : string;
    userId : string;
}

export interface IILikesCreationAttributes extends Omit<ILikes, "id">{}