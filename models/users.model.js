import mongoose from "mongoose";
import bcrycpt from "bcrypt";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"]
    },
    email: {
        type:String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"],
        unique: true,
        required: [true, 'email is required']
    },
    role:{
       type:String,
       default: 'user',
       enum: ['user', 'publisher']
    },
    password:{
        type:String,
        required: [true, "Password is a required field"],
        minlength: [6, " Password must be at least 6 characters"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
          "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        ]
    },
    jwt: {
        type: String,
    },

    resetPasswordToken: 
    {
        type: String},
    resetPasswordExpire:{
        type: Date,
    },

},{
    timestamps: true
}
)

userSchema.pre('save', async function (next) {
    const salt = await bcrycpt.genSalt(10);
    this.password = await bcrycpt.hash(this.password, salt);
    next();
 })


 userSchema.methods.matchPassword = async function (pass) {
    return bcrycpt.compare(pass, this.password)
 }

 userSchema.methods.getResetToken = function (pass) {
    const resetToken = crypto.randomBytes(10).toString('hex');
    console.log(resetToken);
    this.resetPasswordToken = crypto.createHash('sha512').update(resetToken).digest('hex');
    console.log(this.resetPasswordToken);
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;

 }

const User  = mongoose.model('User', userSchema);

export default User;