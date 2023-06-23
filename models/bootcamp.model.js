import mongoose from "mongoose";
import slugify from "slugify";

const bootcampSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Bootcamp is required"],
        unique: true,
        trim: true,
        minlength: [5, "Bootcamp must be at least 5 characters"]
    },
    slug: {type:String},
    description:{
        type:String,
        required: [true, "BootCamp description is required"],
        maxlength: [500, "Bootcamp description must be at most 500 characters"]
    },
    website:{
        type:String,
        match:[/https ?: \/\/ (www\.) ? [-a - zA - Z0 - 9@:%._\+~#=]{ 1, 256}\.[a-zA - Z0 - 9()]{ 1, 6 } \b([-a - zA - Z0 - 9()@:% _\+.~# ?&//=]*)/, "Please enter a valid url for your website"
    ]
    },
    phone:{
        type: Number,
        // required:[20, "Phone must be at least 20 characters"]
    },
    email: {
        type:String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"],
        unique: true,
        required: true
    },
    address:{
        type:String,
        required: [true, "Please enter a valid address"]
    },
    careers:{
        type: [String],
        required: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX Design",
            "Data Science",
            "Artificial Intelligence",
            "Others"
        ]
    },
    averageRating:{
        type:Number,
        min: [1, "Minimum rating should be 1"],
        max: [10, "Maximum rating should be 10"]
    },
    averageCost:{
        type:Number,
    },
    photo:{
        type:String,
    },
    photo_public_id :{
        type:String,
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
}
)

bootcampSchema.pre('save', function(next){
   this.slug = slugify(this.name.toLowerCase())
   next();
})

const BootCamp  = mongoose.model('BootCamp', bootcampSchema);

export default BootCamp;