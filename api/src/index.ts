import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

import AppError from './utils/appError.js';
// import globalErrorHandler from './modules/errorModule/error.service.js';

const app = express();

////////////////
// middlewares
////////////////

app.use(
  cors({
    origin: [process.env.CLIENT_URL!, process.env.ADMIN_URL!],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
  }),
);

// Set security HTTP headers
app.use(helmet());

// body parser, reading data from body into req.body
app.use(express.json());

// cookie parser, reading cookie from req.body
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Development logging
if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`));
}

// limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, Please try again in an hour!`,
});
app.use(`/api`, limiter);

////////////////////////////
// importing routes
////////////////////////////
// const adsRoute = require('./routes/adsRoutes');

//////////////// x
// routes
////////////////
app.use('/api/v1/', (req: Request, res: Response) => {});

app.all(`*`, (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(globalErrorHandler);

export { app };
