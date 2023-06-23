import express from "express";
import bootcampRouter from "./bootcamp.route.js";
import courseRouter from "./course.route.js";
import userRouter from "./user.route.js";
import reviewRouter from "./review.route.js";
import swaggerRouter from "./swagger.route.js";
const router = express.Router();

router.use("/bootcamp", bootcampRouter);
router.use("/courses", courseRouter);
router.use("/users", userRouter);
router.use("/swagger", swaggerRouter);
router.use("/reviews", reviewRouter);
export default router;