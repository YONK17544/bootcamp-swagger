export const filteredResults = (Model) => async (req, res, next) =>{
 try {
         //Advanced Filtering

         const reqQuery = { ...req.query };

         //Fields to remove
         const removeFields = ['select', 'sort', 'page', 'limit'];
   
         removeFields.forEach(param => delete reqQuery[param]);
   
         let queryStr = JSON.stringify(reqQuery);
   
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne|in)\b/, match => `$${match}`)
         queryStr = JSON.parse(queryStr);
         let appendFilterQuery = Model.find(queryStr);
   
   
         //select specific fields
         if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            appendFilterQuery = appendFilterQuery.select(fields);
         }
   
         //sort ascending /descending
         if (req.query.sort) {
            const fields = req.query.sort.split(',').join(' ');
            appendFilterQuery = appendFilterQuery.sort(fields)
            console.log(appendFilterQuery)
         } else {
            appendFilterQuery.sort('-createdAt');
         }
   
         //Pagination
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         //page -2 ->  (page-1)* limit
         const skipData = (page - 1) * limit;
         //Previous page -> skip
         // -> 1 * 3 = 3
         const endIndex = page * limit;
   
         appendFilterQuery = appendFilterQuery.skip(skipData).limit(limit);
         const total = await Model.countDocuments();
   
         const Models = await appendFilterQuery;
   
         const pagination = {};
   
         if(endIndex < total){
            pagination.next = {
               page: page + 1,
               limit
            }
         }
   
         if(skipData > 0){
            pagination.prev = {
               page: page - 1,
               limit
            }
         }
   
         if (Models.length > 0) {
            res.filteredResults = {
              status: true,
              data: Models,
              pagination,
              total
            };
            next();
         } else {
            return res.status(400).json({
               status: false,
               message: `No ${Models} found`
            })
         }
 } catch (error) {
     console.log(error);
 }
}