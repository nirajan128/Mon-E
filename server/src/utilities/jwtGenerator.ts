import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface userData{
    user_id: Int8Array
}


function jwtGenerator(user_id: userData){
  const payload = {
    user : user_id
  }

  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("❌ SECRET_KEY is missing in environment variables!");
  }

  // ✅ Generate JWT
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export default jwtGenerator