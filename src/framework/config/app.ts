import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"

dotenv.config()

import userAuth from '../Routes/userAuth'

const app = express()

app.use(cors({
    origin:"https://localhost:3000",
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

// user Routes
app.use("/",userAuth)


export default app