import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"
import morgan from "morgan";


dotenv.config()

import userAuth from '../Routes/userAuth'

const app = express()

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
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })
); 


// morgan for using console all request
app.use(morgan('dev')) 

// user Routes
app.use("/",userAuth)


export default app