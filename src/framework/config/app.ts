import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"
import morgan from "morgan";
import cookieParser from 'cookie-parser';


dotenv.config()

import userAuth from '../Routes/userAuth'

const app = express()

//cookie-parser middleware
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials:true
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Session Middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'piyuuu',
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: 60000 },
    })
); 



// morgan for using console all request
app.use(morgan('dev')) 

// user Routes
app.use("/",userAuth)


export default app