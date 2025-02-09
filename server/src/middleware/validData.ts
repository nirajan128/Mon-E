import { Request, Response, NextFunction } from "express";

// Define expected user data structure
interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

// Email validation function
const validEmail = (userEmail: string): boolean => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
};

// Middleware function for validating user input
const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { email, firstName, lastName, password } = req.body as UserData;

  if (req.path === "/register") {
    if (![email, firstName, lastName, password].every(Boolean)) {
      res.status(400).json({ message: "Missing Credentials" });
      return; // 🔹 Ensure the function exits
    } else if (!validEmail(email)) {
      res.status(400).json({ message: "Invalid Email" });
      return; // 🔹 Ensure the function exits
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      res.status(400).json({ message: "Missing Credentials" });
      return;
    } else if (!validEmail(email)) {
      res.status(400).json({ message: "Invalid Email" });
      return;
    }
  }

  next(); // 🔹 Ensures proper middleware execution
};

export default validateUser;
