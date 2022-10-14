// post: http://localhost:5000/api/transactions
import model from '../models/model.js';

async function createTransaction(req, res) {
   console.info(req.body);
   if (!Object.entries(req.body).length) return res.status(400).json({
      error: 'Post HTTP data not provided'
   });
   let { name, categoryId, amount } = req.body;

   const newTransaction = await new model.Transactions({
      name,
      categoryId,
      amount,
      date: new Date()
   });

   await newTransaction.save(function(err) {
      if (!err) return res.json(newTransaction);
      return res.status(400).json({
         message: 'Error while creating transaction',
         error: err
      });
   });
}

// get: http://localhost:5000/api/transactions
async function getTransactions(req, res) {
   let data = await model.Transactions.find({}).then();
   let filter = await data.map(v => Object.assign({}, {
      id: v.id,
      categoryId: v.categoryId,
      name: v.name,
      amount: v.amount,
      date: v.date
   }));
   return res.json(filter);
}

// get: http://localhost:5000/api/transactions/:id
async function getTransactionById(req, res) {
   let transactionId = req.params.id;

   console.info(`Get transaction with id=${transactionId}`);

   await model.Transactions.findById(transactionId).then(result => {
      if (result != null) return res.json(result);
      return res.status(404).json({
            error: `Transaction with id=${transactionId} not found`
         }
      );
   }).catch(error => {
      console.error(`Error when get transaction with id=${transactionId}`, error);
      res.status(404).json({
            error: `Transaction with id=${transactionId} not found`
         }
      );
   });
}

// post: http://localhost:5000/api/transactions/:id
async function updateTransactionById(req, res) {
   const transactionId = req.params.id;
   if (!Object.entries(req.body).length) return res.status(400).json({
      error: 'Post HTTP data not provided'
   });
   const { name, categoryId, amount } = req.body;

   console.info(`Update transaction with id=${transactionId}`);
   const filter = { _id: transactionId };
   const update = { name, categoryId, amount };

   await model.Transactions.updateOne(filter, update).then(_ => {
      res.status(204).json();
   }).catch(error => {
      console.error(`Error while update transaction with id=${transactionId}`, error);
      res.status(400).json({
         message: `Error while update transaction with id=${transactionId}`
      });
   });
}

// delete: http://localhost:5000/api/transactions/:id
async function deleteTransaction(req, res) {
   let transactionId = req.params.id;

   console.info(`Delete transaction with id=${transactionId}`);

   const filter = { _id: transactionId };
   await model.Transactions.deleteOne(filter).then(_ => {
      res.status(204).json();
   }).catch(error => {
      console.error(`Error when deleting transaction with id=${transactionId}`, error);

      res.status(404).json({
         error: `Transaction with id ${transactionId} not found`
      });
   });
}

// get: http://localhost:5000/api/labels
async function getLabels(req, res) {
   await model.Transactions.aggregate([
      {
         $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category_info'
         }
      },
      {
         $unwind: '$category_info'
      }
   ]).then(result => {
      let data = result.map(v => Object.assign({}, {
         _id: v._id,
         name: v.name,
         categoryId: v.categoryId,
         type: v.category_info['type'],
         amount: v.amount,
         color: v.category_info['color']
      }));
      res.json(data);
   }).catch(error => {
      console.error('Error when get transaction aggregate with category', error);
      res.status(400).json({
         error: 'Lookup collection error'
      });
   });
}

export default {
   createTransaction,
   getTransactions,
   getTransactionById,
   updateTransactionById,
   deleteTransaction,
   getLabels
};
