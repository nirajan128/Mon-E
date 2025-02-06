import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/use', userRouter); //the first param would be the link path shownd when userRouter is called

//MIDDLE WARE
app.get("/", (req, res) => {
  res.send("Server connected!!!!");
});

app.listen(PORT, () => {
  console.log("Server running on ", PORT);
});