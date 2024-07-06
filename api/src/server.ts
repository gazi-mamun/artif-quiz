import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🎇 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

import { app } from './index.js';

const DB = process.env.DATABASE_LOCAL!;

mongoose.set('strictQuery', false);

mongoose.connect(DB).then(() => console.log('MongoDB connected.!'));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 🎇 Shutting down...');
  console.log(err?.name, err?.message);
  server.close(() => {
    process.exit(1);
  });
});
