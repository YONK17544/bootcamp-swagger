import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const authMiddleware = async (req, res, next) =>{
 try {
    console.log(req.headers);
    console.log(req.headers.authorization);
    console.log(req.headers.authorization.startsWith('Bearer '))
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
       const token = req.headers.authorization.split(" ")[1];
       const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
       const user =  await User.findOne({_id : validatedData.id});
       console.log(user);
       req.user = user;
       next();
    }else{
      return res.status(401).json({
          status: false,
          message:"Unauthorized user"
      })
    }
 } catch (error) {
    console.log(error);
 }
}

export const authorize = (...roles) => async (req, res, next) => {
   console.log(req.user.role);
   console.log(roles.includes(req.user.role));
   if (roles.includes(req.user.role)){ 
      next();
   }else{
      res.status(400).send({
         status: false,
         message: "You are not allowed to access this resource"
      })
   }
}

 