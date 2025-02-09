import db from "../config/db";
import bcrypt from "bcrypt";


// 🔹 **Register User , Return Type User**
export const registerUser = async (email: string, password: string, firstName:string, lastName:string) => {
    try {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);
     
      const query = `INSERT INTO usermone (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await db.query(query, [email, bcryptPassword, firstName, lastName]);
      return result.rows[0];
    } catch (err) {
      console.error("❌ Error registering user:", err);
      throw err;
    }
  };

  