import router from './src/routes/route.js';
import conn from './src/db/connection.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: './config.env' });
const port = process.env.PORT ?? 5000;

// use middleware
app.use(cors());
app.use(express.json());

// mongodb connection

// using routes
app.use(router);

conn.then(db => {
   if (!db) return process.exit(1);

   // listen to the http server
   app.listen(port, () => {
      console.info(`Server is running on port ${port}`);
   });

   app.on('error', err => console.error('Failed to connect with HTTP server', err));

   //error in mongodb connection
}).catch(err => {
   console.error('Connection failed!', err);
});

