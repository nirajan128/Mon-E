import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

//1.Check if secret exists
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("❌ SECRET_KEY is missing in environment variables!");
}


//2. ✅ Extend Request Type to Include `user` since the user is not available by default in Request
interface AuthenticatedRequest extends Request {
    user?: any; // `any` can be replaced with a specific user type
}
export default async (req: AuthenticatedRequest , res: Response , next: NextFunction) =>{
   try {
    //1. destrcuture the token sent by the frontend
    const jwtToken = req.headers["token"];

     //2.Check if the token exists if not dont give access
     if (!jwtToken) {
        return res.status(403).send("You are not authorized");
      }

      //3. if it does verify it and pass user data
    const payload = jwt.verify(jwtToken as string, SECRET_KEY);
    req.user = payload;

    // 5. Move to the next middleware/route handler
    next();
   } catch (error) {
    res.status(401).json({ message: "Invalid token" });
   }
}