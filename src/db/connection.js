import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });
const conn = mongoose.connect(process.env.ATLAS_URI).then(db => {
   console.info('Database connected');
   return db;
}).catch(err => console.error(err, 'Connection error'));

export default conn;
