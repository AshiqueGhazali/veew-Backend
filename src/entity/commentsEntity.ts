export interface IComments {
    id:string;
    eventId:string;
    userId:string;
    comment:string;
    parentId:string | null;
}

export interface ICommentsCreationAttributes extends Omit<IComments,"id">{}