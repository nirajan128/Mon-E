import { Router, Request, Response } from "express";
import { registerUser } from "../model/dataModel";
import validData from "../middleware/validData";
import db from "../config/db";
import bcrypt from "bcrypt";
import jwtGenerator from "../utilities/jwtGenerator";

const route = Router();

route.get("/forms", (req: Request, res: Response): void => {
    res.json("Formss");
});

route.post("/register", validData, async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Get data from frontend
        const { firstName, lastName, email, password } = req.body;
        
        // 2. Call the data model function to create a user in the DB
        await registerUser(email, password, firstName, lastName);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

route.post("/login", validData, async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await db.query("SELECT * FROM usermone WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            res.status(401).json({ error: "Credentials do not match" });
            return;  // Ensure function stops execution
        }

        // 2. Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            res.status(401).json({ error: "Credentials do not match" });
            return;
        }

        // 3. Generate JWT token
        const token = jwtGenerator(user.rows[0].id);

        // 4. Return token to the frontend
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default route;
