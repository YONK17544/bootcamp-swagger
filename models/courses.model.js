import mongoose from 'mongoose';

const courseSchema = mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, "Title is required field"]
    },
    description:{
        type: String,
        trim: true,
        required: [true, "Description is required field"]
    },
    weeks:{
        type: String,
        reuired: [true, "Weeks is required field"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Minimum Skill is required field"],
        enum: [
            "beginner",
            "intermediate",
            "advanced"
        ]
    },
    content: {
        type: [String],
        required: [true, "Content is required field"],
    },
    scholarshipAvailable:{
        type: Boolean,
        default: false
    },
    bootcamp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BootCamp',
        // required: true
    
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    }

})

const Course = mongoose.model('Course', courseSchema);

export default Course;