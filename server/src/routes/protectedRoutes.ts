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

/**
 * @route   POST /expenses
 * @desc    Add a new expense for the authenticated user
 */
route.post("/expenses", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount, category, description,paymentType } = req.body;

        const result = await db.query(
            "INSERT INTO moneexpenses (id, amount, category, description, payment_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, amount, category, description, paymentType]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @route   PUT /expenses
 * @desc    Updates expenses for the authenticated user
 */
route.put("/expenses/:id", async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const expenseId = req.params.id;
        const { amount, category, description, paymentType } = req.body;

        const result = await db.query(
            "UPDATE moneexpenses SET amount = $1, category = $2, description = $3, payment_type = $4 WHERE expense_id = $5 AND id = $6 RETURNING *",
            [amount, category, description,paymentType, expenseId, userId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Expense not found or unauthorized" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


/**
 * @route   DELETE /expenses
 * @desc    Delete expenses for the authenticated user
 */
route.delete("/expenses/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const expenseId = req.params.id;

        const result = await db.query(
            "DELETE FROM moneexpenses WHERE expense_id = $1 AND id = $2 RETURNING *",
            [expenseId, userId]
        );

        if (result.rowCount === 0) {
           res.status(404).json({ error: "Expense not found or unauthorized" });
           return;
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

/**
 * @route   GET /income
 * @desc    Get all income for the authenticated user
 */
route.get("/income", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Get user ID from session
        const result = await db.query("SELECT * FROM moneincome WHERE id = $1", [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @route   POST /income
 * @desc    Add a new income for the authenticated user
 */
route.post("/income", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount, source, description,Tax,cpp,el } = req.body;

        const result = await db.query(
            "INSERT INTO moneincome (id, amount, source, description, Tax, CPP, EI) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
            [userId, amount, source, description, Tax,cpp,el]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding income:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @route   PUT /income
 * @desc    Updates income for the authenticated user
 */
route.put("/income/:id", async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const expenseId = req.params.id;
        const { amount, source, description, tax,cpp,el } = req.body;

        const result = await db.query(
            "UPDATE moneincome SET amount = $1, source = $2, description = $3, Tax=$4, CPP=$5, EI=$6 WHERE income_id = $7 AND id = $8 RETURNING *",
            [amount, source, description,tax,cpp,el, expenseId, userId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Income data not found or unauthorized" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error("Error updating income:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


/**
 * @route   DELETE /income
 * @desc    Delete income for the authenticated user
 */
route.delete("/income/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const expenseId = req.params.id;

        const result = await db.query(
            "DELETE FROM moneincome WHERE income_id = $1 AND id = $2 RETURNING *",
            [expenseId, userId]
        );

        if (result.rowCount === 0) {
           res.status(404).json({ error: "Expense not found or unauthorized" });
           return;
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


// Add this at the end of your route file
route.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



export default route;