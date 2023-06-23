import cloudinary from "../config/cloudinary.config.js";
import BootCamp from "../models/bootcamp.model.js"; 
import Course from "../models/courses.model.js";

export const getBootcamp = async (req, res) => {
   try {
       res.status(200).send(res.filteredResults);
   } catch (error) {

   }
}

export const addBootcamp = async (req, res) => {
   try {
      let uploadedFile = await cloudinary.v2.uploader.upload(req.file.path);
      const data = req.body;
      data.photo = uploadedFile.secure_url;
      data.photo_public_id = uploadedFile.public_id; 
      data.user = req.user._id;
      const bootcamp = new BootCamp(data);
      await bootcamp.save()

      res.status(200).json({
         status: true,
         message: 'Bootcamp created successfully',
         data: bootcamp
      })

   } catch (error) {
      console.log(error)
   }
}
 
export const deleteBootCamp = async (req, res) =>{
  try {
   const { id } = req.params;

   const bootcamp = await BootCamp.findById(id);

   if (!bootcamp){
      return res.status(400).json({
         status: false,
         message: 'Bootcamp not found'
      })
   }
   if (req.user._id.toString() === bootcamp.user.toString() ){

      const deleteBootCamp = await BootCamp.findOneAndDelete({_id: id});

      const courses = await Course.find({bootcamp: id})
      
      if (courses.length > 0){
         await Course.deleteMany({
            bootcamp:id
         })
      }

      if(deleteBootCamp){
         return res.status(200).json({
            status: true,
            data: deleteBootCamp,
            message: 'Bootcamp deleted'
         })
      }
   
   }else{
      res.status(400).json({
         status: false,
         message: 'Only User can delete'
      })
   }
  } catch (error) {
    console.log(error);
  }
    }
 
export const updateBootcamp = async (req, res) => {
   try{
      const { id } = req.params;
      const { isImageUpdate } = req.body;
      const data = req.body;

      const bootcamp = await BootCamp.findById(id);
  
      if(!bootcamp){
         return res.status(400).json({
            status: false,
            message: "Bootcamp not found"
         })
      }
      if (bootcamp.user === req.user._id){
      if(isImageUpdate){
         await cloudinary.v2.uploader.destroy(bootcamp.photo_public_id);
         let uploadedFile = await cloudinary.v2.uploader.upload(req.file.path);
         data.photo = uploadedFile.secure_url;
         data.photo_public_id = uploadedFile.public_id;
      }

      const updatedBootcamp = await BootCamp.findOneAndUpdate(
         {_id: id },
         {
            $set: data
         },
         {new: true}
      )

      res.status(200).json({
         status: true,
         data: updatedBootcamp,
         message: 'Bootcamp updated'
      })
   }else{
      res.status(400).json({
         status: false,
         message: 'Only User can update'
      })
   }

   }catch{
       console.log(error);
   }
}