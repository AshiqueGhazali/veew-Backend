import { Model, ModelDefined } from "sequelize";
import IUserRepository, { editData } from "../../interface/repository/IUserRepository";
import { IUser, IUserCreationAttributes } from "../../entity/userEntity";


class UserRepository implements IUserRepository {
    private UserModel : ModelDefined<IUser,IUserCreationAttributes>

    constructor(UserModel:ModelDefined<IUser,IUserCreationAttributes>){
        this.UserModel = UserModel
    }

    async fetchProfileData(userId: string): Promise<Model<IUser, IUserCreationAttributes> | null> {
        try {

            if(userId){
                const userData = await this.UserModel.findOne({where:{
                    id:userId
                }})     
                
                return userData
            }else{
                console.log("no user fountttdddd");
                
                return null
            }
            

        } catch (error) {
            throw error
        }
    }

    async editProfile(userId: string, data: editData): Promise<void> {
        try {
            const profileUpdate = await this.UserModel.update(data,{where:{
                id:userId
            }})
            return
        } catch (error) {
            console.log("us eggegeggegge");
            
            throw error
        }
    }

    async editImage(userId: string, image: string): Promise<void> {
        try {
            await this.UserModel.update({image:image},{where:{
                id:userId
            }})            
            return
        } catch (error) {            
            throw error
        }
    }

}

export default UserRepository