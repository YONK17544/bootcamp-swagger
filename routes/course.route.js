import express from "express";
import { addCourse, deleteCourse } from "../controllers/courses.controller.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) =>{
    res.send("Hello Course");
})

router.post("/:id",authMiddleware, authorize('publisher', 'admin'), addCourse)

router.delete("/delete/:id",authMiddleware, authorize('publisher', 'admin'), deleteCourse)

export default router;