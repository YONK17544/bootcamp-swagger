import express from "express";
import { addReview, deleteReview } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) =>{
    res.send("Hello Reviews");
})


router.post("/addReview",authMiddleware, addReview)

router.delete("/delete/:id",authMiddleware, deleteReview)


export default router;