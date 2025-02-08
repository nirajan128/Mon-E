import { Router } from "express";

const route = Router();

route.get("/hey", (Request,Response) => {
    Response.json("Helloooo")
})

export default route;