import express from "express";
import { addBootcamp, deleteBootCamp, getBootcamp, updateBootcamp } from "../controllers/bootcamp.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";
import { filteredResults } from "../middlewares/filteredResults.middleware.js";
import BootCamp from "../models/bootcamp.model.js";

const router = express.Router();

router.get("/", authMiddleware, filteredResults(BootCamp), getBootcamp)

router.post('/', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), addBootcamp);

router.patch('/update/:id', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), updateBootcamp);

router.delete("/delete/:id", authMiddleware, authorize('publisher', 'admin'), deleteBootCamp)
export default router;