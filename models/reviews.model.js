import mongoose from "mongoose";

const reviewsSchema =  mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, "Review name is required field"],
        // maxLength: [2, "Minimum length is 60 characters"]
    },
    description:{
        type: String,
        trim: true,
        required: [true, "Review description is required field"],
        // maxLength: [10, 'Maximum length is 500 characters']
    },
    rating:{
        type:Number,
        min: [1, "Minimum rating should be 1"],
        max: [10, "Maximum rating should be 10"],
        required: [true, "Rating is required field"]
    },
    bootcamp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bootcamp',
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
}
)

const Reviews = mongoose.model('Reviews', reviewsSchema);

export default Reviews;