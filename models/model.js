import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// categories => field => {type: string, color: string}
const categoryModel = new Schema({
   type: { type: String, default: 'Default', required: true },
   color: { type: String, default: '#FCBE44', required: true }
});

// transaction => field => {name: string, type: string, amount: number, date: Date}
const transactionModel = new Schema({
   categoryId: { type: mongoose.Schema.ObjectId, required: true },
   name: { type: String, required: true },
   amount: { type: Number, required: true },
   date: { type: Date, default: Date.now }
});

const Categories = mongoose.model('categories', categoryModel);
const Transactions = mongoose.model('transactions', transactionModel);

export default { Categories, Transactions };

