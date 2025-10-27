import express, { type Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';

export function setupMiddleware(app: Express): void {
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cors());
}
