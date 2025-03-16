import express from 'express';
import cors from 'cors';
import passport from "passport";
import session from "express-session"
import "./config/passport";
import authRoutes from "./routes/authRoute";
import protectedRoute from './routes/protectedRoutes';

const app = express();
const PORT = 5000;

//Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

//initialize passport and session
// Express session middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
    })
  );
  
// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res) =>{
    res.json("Hello");
})

app.use("/auth", authRoutes);
app.use("/valid", protectedRoute)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


