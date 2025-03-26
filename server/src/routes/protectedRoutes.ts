import { Router, Request, Response, NextFunction } from "express";
import jwtAuthenticator from "../middleware/jwtAuthenticator";
import { isAuthenticated } from "../middleware/googleAuth";
import db from "../config/db";

const route = Router();

//[Uses jwtAuthenticator middleware], when user post a login request a jwtToken is generated which is tored in local session
// after logged in the user makes a get request /dashboard which uses the middleware to check the token stored in localstorage aginst the JWT secret
// if it passes, the route moves on to next middleware which displays the validUserData

//Also uses [isAuthenticated middleware] of express for googleOAuth

// Middleware: Requires authentication (JWT or Google OAuth)
route.use(jwtAuthenticator, isAuthenticated);

route.get("/dashboard", (req:Request, res:Response, next:NextFunction) => {
    const validUser = (req as any).user;
    /* console.log(validUser); */
     res.json(validUser);
});

/**
 * @route   GET /expenses
 * @desc    Get all expenses for the authenticated user
 */
route.get("/expenses", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Get user ID from session
        const result = await db.query("SELECT * FROM moneexpenses WHERE id = $1", [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default route;