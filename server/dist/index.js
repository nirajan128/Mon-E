"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use('/api/use', userRoutes_1.default); //the first param would be the link path shownd when userRouter is called
//MIDDLE WARE
app.get("/", (req, res) => {
    res.send("Server connected!!!!Damn");
});
app.listen(PORT, () => {
    console.log("Server running on ", PORT);
});
