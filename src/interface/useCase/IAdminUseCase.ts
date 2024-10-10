export interface loginParams {
    userName:string;
    password:string
}
export  interface adminresObj{
    status:boolean,
    message:string,
    token?:string,
}

export interface adminVerifyTokenResponse{
    status:boolean,
    decoded?:object
 }

export default interface IAdminUseCase {
    verifyLogin({userName,password}:loginParams):Promise<adminresObj|null>
    verifyToken(token:string):Promise<adminVerifyTokenResponse>
}