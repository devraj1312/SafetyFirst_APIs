import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(sessionMiddleware);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/customers', customerRoutes); 

const port = process.env.PORT || 5000;

console.log(`Server running on port ${port}`);
app.listen(port, () => {
});