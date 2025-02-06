import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;
app.use(express.json());

//MIDDLE WARE
app.get("/", (req, res) => {
  res.send("Server connected!!!!");
});

app.listen(PORT, () => {
  console.log("Server running on ", PORT);
});