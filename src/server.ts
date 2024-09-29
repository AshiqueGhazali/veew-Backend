import app from "./framework/config/app";
import {sequelize} from './framework/config/sequelize'
const PORT = process.env.PORT || 3000 ;

sequelize 
.authenticate()
.then(()=>{
    console.log('Connection to PostgreSQL established successfully');
    app.listen(PORT,()=>{
        console.log(`Server running on http://localhost:${PORT}`);
    })   
})
.catch((err)=>{
    console.error("Unable to connect to the database:",err);
    
})