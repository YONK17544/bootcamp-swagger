
import BootCamp from "../models/bootcamp.model.js";
import Course from "../models/courses.model.js";
import Reviews from "../models/reviews.model.js";

export const addReview = async (req, res) =>{
    try {
        const user =  req.user._id

        const { bootcamp, course } = req.body;

        req.body.user = user;

        if(course){
            const crse = await Course.findOne({_id: course});

            if(crse){
               const review = await postReview(req.body);

               if(review){
                return res.status(200).json({
                    status: true,
                    data: review,
                    message: "Review added successfully"
                 })
            }
            }else{
                return res.status(400).json({
                    status: false,
                    message: "No course found"
                 })
            }
        }

        if(bootcamp){
            const bcmp = await BootCamp.findOne({_id: bootcamp});

            if(bcmp){
                const review = await postReview(req.body);

                if(review){
                    return res.status(200).json({
                        status: true,
                        data: review,
                        message: "Review added successfully"
                     })
                }
            }else{
                return res.status(400).json({
                    status: false,
                    message: "No bootcamp found"
                 })
            }
        }

     } catch (error) {
        console.log(error);
     }
}

const postReview = async (data) =>{
    const review = new Reviews(data);

    await review.save();

    return review;

}
export const deleteReview = async (req, res) => {
    const ReviewId = req.params.id;

    const user = req.user._id;
 
    const review =  await Reviews.findOne({_id : ReviewId, user: user});
 
    if (review.user = user){
        const deleted = await Reviews.findOneAndDelete({
            _id: review._id
         })
         return res.status(200).json({
            status: true,
            data: deleted,
            message: " Review deleted successfully"
         })
     }else{
        return res.status(400).json({
            status: true,
            message: "Only creator can delete"
         })
     }
}