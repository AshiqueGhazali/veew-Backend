import { DataTypes, ModelDefined } from "sequelize";
import sequelize from "../config/sequelize";
import { IPricing, IPricingCreationAttributes } from "../../entity/pricingEntity";


const Pricing : ModelDefined<IPricing, IPricingCreationAttributes> = sequelize.define(
    'Pricing',
    {
        id:{
            type:DataTypes.UUIDV4,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        category:{
            type:DataTypes.ENUM('PRICING', 'SUBSCRIPTION'),
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        expiredAfter:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        NumberOfEvents:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        description:{
            type:DataTypes.STRING,
            allowNull:false
        }

    },{
        tableName: 'pricing',
        timestamps: true
    }
)

export default Pricing