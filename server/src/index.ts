import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import database from "./config/db";

dotenv.config();
const app = express();
const PORT = 5000;

//Use cors let the frontend URL access of the backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/user', userRouter); //the first param would be the link path shownd when userRouter is called


//MIDDLE WARE
app.get("/", (req, res) => {
  res.send("Server connected!!!!Damn");
});


app.listen(PORT, () => {
  console.log("Server running on ", PORT);
});