import express, { Request, Response } from "express";
import db from "../config/db";
import jwtAuth from "../middleware/jwtAuth";

const router = express.Router();

router.get("/dashboard", jwtAuth, async (req: Request, res: Response) => {
    try {
        const validatedUser = await db.query('SELECT * FROM usermone WHERE id=$1', [(req as any).user])
        const usersData = validatedUser.rows[0];
        res.json({message: usersData.email})
    } catch (error) {
      console.log(error)   
    }
});

export default router;
