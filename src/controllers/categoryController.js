// post: http://localhost:5000/api/categories
import model from '../models/model.js';

async function createCategories(req, res) {
   if (!req.body) return res.status(400).json({
      message: 'Post HTTP data not provided'
   });

   let { type, color } = req.body;
   const newCategory = new model.Categories({
      type: type,
      color: color
   });

   await newCategory.save(function(err) {
      if (!err) return res.json(newCategory);
      return res.status(400).json({
         message: 'Error while creating category',
         error: err
      });
   });
}

// get: http://localhost:5000/api/categories
async function getCategories(req, res) {
   await model.Categories.find({}, { __v: false }).then(result => {
      res.json(result);
   }).catch(error => {
      console.error('Error when get all categories', error);
      res.status(500).json({
            error: 'Something was wrong'
         }
      );
   });
}

// get: http://localhost:5000/api/categories/:id
async function getCategoryById(req, res) {
   const categoryId = req.params.id;
   console.info(`Get category with id=${categoryId}`);

   const projection = {
      __v: false
   };

   await model.Categories.findById(categoryId, projection).then(result => {
      if (result != null) return res.json(result);
      return res.status(404).json({
            error: `Category with id=${categoryId} not found`
         }
      );
   }).catch(error => {
      console.error(`Error when get category with id=${categoryId}`, error);
      res.status(404).json({
            error: `Category with id=${categoryId} not found`
         }
      );
   });
}

// post: http://localhost:5000/api/categories/:id
async function updateCategoryById(req, res) {
   const categoryId = req.params.id;
   if (!Object.entries(req.body).length) return res.status(400).json({
      error: 'Post HTTP data not provided'
   });
   let { type, color } = req.body;

   console.info(`Update category with id=${categoryId}`);
   const filter = { _id: categoryId };
   const update = { type, color };


   await model.Categories.updateOne(filter, update).then(_ => {
      res.status(204).json();
   }).catch(error => {
      console.error(`Error while update category with id=${categoryId}`, error);
      res.status(400).json({
         message: `Error while update category with id=${categoryId}`
      });
   });
}

// delete: http://localhost:5000/api/categories/:id
async function deleteCategoryById(req, res) {
   let categoryId = req.params.id;

   console.info(`Delete category with id=${categoryId}`);

   const filter = { _id: categoryId };
   await model.Categories.deleteOne(filter).then(result => {
      if (result.deletedCount > 0) return res.status(204).json();
      res.status(404).json({
         error: `Category with id ${categoryId} not found`
      });
   }).catch(error => {
      console.error(`Error when get category with id=${categoryId}`, error);

      res.status(404).json({
         error: `Category with id ${categoryId} not found`
      });
   });
}

export default {
   createCategories,
   getCategories,
   getCategoryById,
   updateCategoryById,
   deleteCategoryById
};
