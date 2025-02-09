import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
    user?: string;
}

const jwtAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied, no token provided" });
        return; // Ensure function stops execution here
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = decoded.id;
        next(); // Proceed to next middleware
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default jwtAuth;
