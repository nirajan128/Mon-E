import express, { Request, Response } from "express";
import jwtAuth from "../middleware/jwtAuth";

const router = express.Router();

router.get("/dashboard", jwtAuth, (req: Request, res: Response) => {
    res.json({ message: "Welcome to the protected dashboard!", userId: (req as any).user });
});

export default router;
