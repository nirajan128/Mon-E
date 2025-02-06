import { Router } from "express";

const route = Router();

route.get("/", (Request,Response) => {
    Response.send("Helloooo")
})

export default route;