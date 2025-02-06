"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
route.get("/", (Request, Response) => {
    Response.send("Helloooo");
});
exports.default = route;
