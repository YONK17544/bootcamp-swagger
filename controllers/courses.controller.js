import User from "../models/users.model.js";
import BootCamp from "../models/bootcamp.model.js";
import Course from "../models/courses.model.js";

export const addCourse = async (req, res) =>{
     try {
        const BootCampId = req.params.id;

        const bootcamp =  await BootCamp.findOne({_id : BootCampId});

        const bootcampuser =  req.user._id

        const data = req.body;
     
        data.bootcamp = bootcamp._id;

        data.user = bootcampuser;

        const courses = new Course(data);
        await courses.save()

        res.status(200).json({
         status: true,
         message: 'Courses created successfully',
         data: courses
      })
  

     } catch (error) {
        console.log(error);
     }
}

export const deleteCourse = async(req, res) =>{
   const CoursesId = req.params.id;

   const user = req.user._id;

   const course =  await Course.findOne({_id : CoursesId, user: user});

   if (course.user = user){
       const deleted = await Course.findOneAndDelete({
           _id: course._id
        })
        return res.status(200).json({
           status: true,
           data: deleted,
           message: " Course deleted successfully"
        })
    }else{
       return res.status(400).json({
           status: true,
           message: "Only creator can delete"
        })
    }
}