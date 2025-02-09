import { Router } from "express";
import { registerUser } from "../model/dataModel";
import validData from "../middleware/validData";
import db from "../config/db"
import bcrypt from "bcrypt";import jwtGenerator from "../utilities/jwtGenerator";
;

const route = Router();

route.get("/forms", (req, res) =>{
    res.json("Formss")
})

route.post("/register", validData, async (req,res) => {

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

route.post("/login", validData, async(req, res)=>{
    //1. get the input data from front end
    const{email, password} = req.body;

    try {
       //2. Check if user doesent exist, if not throw error
    const user = await db.query("SELECT * FROM usermone WHERE email = $1", [
        email,
      ]);
      if (user.rows.length === 0) {
            res.status(401).send("Credentials does not match");
      }
  
      //3. if exist, check if incoming and db password are same
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
  
      if (!validPassword) {
         res.status(401).send("Credentials don't match");
      }

      //4. if the password match and user exists generate a jwt
      const token = jwtGenerator(user.rows[0].id)

      //5. return jwt to the front end
      res.json({token});
    } catch (error) {
        console.log(error);
        res.json({error});
    }
})

export default route;