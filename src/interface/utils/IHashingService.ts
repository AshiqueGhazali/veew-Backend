
export default interface IhasingService {
     
    hashing(password:string):Promise<string>
    compare(password:string,hashedPassword:string):Promise<boolean>                 
}