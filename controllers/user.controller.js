import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';
import bcrycpt from "bcrypt";

export const register = async (req, res) => {
    try {
       const { name, email, password } = req.body;
    
       const currentUser = await User.findOne({email});
    if (!currentUser){
     // if (name && email && password) {
       const user =  new User(req.body);
       await user.save();
    
       res.status(200).json({
          status: true,
          data: user,
          message: "user created successfully"
       })
    // }
    }else{
       res.status(400).json({
          status: false,
          message:"Email already registered",
       })
    }
       
    } catch (error) {
       res.status(400).json({
          status: false,
          error: error.message,
       })
    }
    }
    
    export const loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
    
       const user = await User.findOne({email});
    
       if (!user) {
          return res.status(401).json({
             status: false,
             message: "Invalid email or password"
          })
       } else{
          const matchPassword = await user.matchPassword(password);
          console.log(matchPassword);
          if (matchPassword){
    
             const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'} )
    
             // const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
             // console.log(decryptToken);
    
             const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},{
                   $set:{ jwt:token },
                },{
                    new:true
                }
             )
             console.log(updatedUser);
    
             return res.status(200).json({
                status: true,
                data: token,
                message: "User logged in successfully"
             })
          }else{
             return res.status(400).json({
                status: false,
                message: "Invalid password"
             })
          }
       }
    
       
    } catch (error) {
       res.status(400).json({
          status: false,
          error: error.message,
       })
    }
    }

    export const logOut = async (req, res) => {
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
         const user = await User.findOneAndUpdate(
            {_id: validatedData.id},{
               $set:{ jwt: ""},
            },{
                new:true
            }
         )
         return res.status(200).json({
            status: true,
            data: user,
            message: "User logged out successfully"
         })
      } 
      
    }

    export const getUser = async (req, res) => {
      return res.status(200).json({
         status: true,
         data: req.user,
         message: "User found"
      })
   
   }

    export const updateDetails = async (req, res) =>{
      const { email, name } = req.body;
      
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
         const user =  await User.findOneAndUpdate(
            {_id : validatedData.id},{
               $set:{ name:name, email: email},
            },{
                new:true
            }
         )
         return res.status(200).json({
            status: true,
            data: user,
            message: "User updated successfully"
         })
      }
    }

    export const updatePassword = async (req, res) =>{
      const { password, newPassword } = req.body;

      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
         const user =  await User.findOne({_id : validatedData.id})
         const hashedPass = await hashPassword(newPassword);
         const matchedPassword = user.matchPassword(password);
         if (matchedPassword) {
            const updatedPass = await User.findOneAndUpdate({
               _id: user._id
            }, {
               $set: {
                  password: hashedPass
               }
            }, {
               new: true
            })
            return res.status(200).json({
               status: true,
               data: updatedPass,
               message: "Password updated successfully"
            })
         }else{
            return res.status(400).json({
               status: false,
               message: "Failed to update password"
            })
         }
      }
    }
    export const forgotPassword = async (req, res) => {
      try {
         const { email } = req.body;
         const user = await User.findOne({ email })
         if (!user) {
            return res.status(400).json({
               status: false,
               message: 'No user found'
            })
         }
         const resetToken = user.getResetToken();
         
         const message = 'You are receiving this email because you have requested to reset your password. Your reset token is:' + resetToken;
         
           try {
            await sendEmail({
               email,
               subject: 'Password reset token',
               message
            })    
            await user.save({validateBeforeSave: false});
            return res.status(201).json({
               status: true,
               message: "Email sent successfully"
            })

           } catch (error) {
            console.log(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            return res.status(400).json({
               status: false,
               message: "Email send failed"
            })
           }
           
      } catch (error) {
           console.log(error);
      }
   }

    export const resetPassword = async (req, res) =>{
      try {
         const { resettoken } = req.params;

         const resetPasswordToken =  crypto.createHash('sha512').update(resettoken).digest('hex');
         const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{ $gt: Date.now()}
         })
         if (!user) {
            return res.status(400).json({
               status: false,
               message: 'Invalid password token or password expired'
            })
         }
         
         user.password = req.body.password;
         user.resetPasswordToken = '';
         user.resetPasswordExpire = '';

         const password = await hashPassword(req.body.password)
         const updatePass = await User.findOneAndUpdate({
            _id: user._id
         },{
            $set:{
               password,
               resetPasswordToken: undefined,
               resetPasswordExpire: undefined,
            }
         }, {
            new: true
         }
         )
           if (updatePass){    
            return res.status(200).json({
            status: true,
            message: "Password reset successfully"
         })
           }

      } catch (error) {
         console.log(error);
      }
   }

   const hashPassword = async (password) =>{
         const salt = await bcrycpt.genSalt(10);
         return bcrycpt.hash(password, salt);

   }

   export const AdminCreate = async (req, res) => {
      try {
         const { name, email, password } = req.body;
      
         const currentUser = await User.findOne({email});
      if (!currentUser){
       // if (name && email && password) {
         const user =  new User(req.body);
         await user.save();
      
         res.status(200).json({
            status: true,
            data: user,
            message: "user created successfully"
         })
      // }
      }else{
         res.status(400).json({
            status: false,
            message:"Email already registered",
         })
      }
         
      } catch (error) {
         res.status(400).json({
            status: false,
            error: error.message,
         })
      }
   }

  export const AdminUpdate = async (req, res) => {
  
     const UserId = req.params.id;
     const { email, name} = req.body;
      const user =  await User.findOne({_id : UserId});

      const updatedUser = await User.findOneAndUpdate({
         _id: user._id
      }, {
         $set: {
            name:name, email: email
         }
      }, {
         new: true
      })
      return res.status(200).json({
         status: true,
         data: updatedUser,
         message: "User updated successfully"
      })
  
   }

  export const AdminDelete = async (req, res) =>{
   const UserId = req.params.id;

   const user =  await User.findOne({_id : UserId});
   
   const deletedUser = await User.findOneAndDelete({
      _id: user._id
   })
   return res.status(200).json({
      status: true,
      data: deletedUser,
      message: " User deleted successfully"
   })
  }
