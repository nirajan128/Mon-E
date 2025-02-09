import { Router } from "express";
import { registerUser } from "../model/dataModel";
import db from "../config/db";

const route = Router();

route.get("/forms", (req, res) =>{
    res.json("Formss")
})

route.post("/register", async (req,res) => {

    try {
        //1. get the data from front end
  const {firstName, lastName, email, password} = req.body;
     //3. call the dataModal and pass the param, this will create a user in db
     await registerUser(email, password, firstName, lastName);
     res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
 
})

export default route;