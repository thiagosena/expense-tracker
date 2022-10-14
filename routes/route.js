import categoryController from '../controllers/categoryController.js';
import transactionController from '../controllers/transactionController.js';
import { Router } from 'express';

const router = new Router();


// Categories routes
router.route('/api/categories')
   .post(categoryController.createCategories)
   .get(categoryController.getCategories);


router.route('/api/categories/:id')
   .get(categoryController.getCategoryById)
   .post(categoryController.updateCategoryById)
   .delete(categoryController.deleteCategoryById);


// Transactions routes
router.route('/api/transactions')
   .post(transactionController.createTransaction)
   .get(transactionController.getTransactions);

router.route('/api/transactions/:id')
   .get(transactionController.getTransactionById)
   .post(transactionController.updateTransactionById)
   .delete(transactionController.deleteTransaction);

router.route('/api/labels')
   .get(transactionController.getLabels);

export default router;
