import express from "express";
import { AdminCreate, AdminDelete, AdminUpdate, forgotPassword, getUser, logOut, loginUser, register, resetPassword, updateDetails, updatePassword,} from "../controllers/user.controller.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";
import User from "../models/users.model.js";

const router = express.Router();


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a user.
 *     tags: [User]
 *     requestBody:
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name: 
 *               type: string 
 *             email: 
 *               type: string 
 *             password: 
 *               type: string 
 *           example:
 *             name: Nirajan Kunwor 
 *             email: nk@gmail.com
 *             password: Test1234
 *     responses:
 *       200:
 *         description: User Created Successfully
 *       400:
 *         description: User not found
*/
router.post("/register", register)

router.post("/login", loginUser)

router.post("/logout",authMiddleware, logOut)

router.post("/me",authMiddleware, getUser)

router.post("/updatedetails",authMiddleware, updateDetails)

router.patch("/updatepassword",authMiddleware, updatePassword)

router.post("/forgotpassword", forgotPassword)

router.put("/resetPassword/:resettoken", resetPassword)

//admin privilege
router.get("/roles/read", authMiddleware, authorize('admin'), function (req , res) {
   User.find({}).then(function (users) {
   res.send(users);
   });
  })

router.post("/roles/create", authMiddleware, authorize('admin'), AdminCreate)

router.patch('/roles/update/:id', authMiddleware, authorize('admin'), AdminUpdate)

router.delete('/roles/delete/:id', authMiddleware, authorize('admin'), AdminDelete)

export default router;