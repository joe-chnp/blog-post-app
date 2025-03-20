import { Router } from "express";

const memberRouter = Router();

memberRouter.get("/", async (req, res) => {
    return res.json({ message: "get all members" });
});

memberRouter.get("/:id", async (req, res) => {
    return res.json({ message: "get member by id" });
});

memberRouter.post("/", async (req, res) => {
    return res.json({ message: "created member successfully" });
});

memberRouter.put("/:id", async (req, res) => {
    return res.json({ message: "updated member successfully" });
});

memberRouter.delete("/:id", async (req, res) => {
    return res.json({ message: "deleted member successfully" });
});

export default memberRouter;