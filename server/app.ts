import express, {Request , Response , NextFunction } from 'express'
import cors from 'cors'
require("dotenv").config()
import cookieParser from "cookie-parser"
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import userRouter from './routes/user.route';
import hostelRouter from './routes/hostel.route';
import roomRouter from './routes/room.routes';
import socialRouter from './routes/social.route';
import { apiLimiter, authLimiter } from './middlewares/rateLimter';
import layoutRouter from './routes/layout.route';
import analyticsRouter from './routes/analytics.route';

export const app = express();

app.set('trust proxy', 1);

app.use(cookieParser())
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api/v1' , apiLimiter)

app.use('/api/v1' , authLimiter, userRouter)
app.use('/api/v1' , hostelRouter)
app.use('/api/v1' , roomRouter)
app.use('/api/v1' , socialRouter)
app.use('/api/v1' , layoutRouter)
app.use('/api/v1' , analyticsRouter)

app.get('/api/v1/test' , (req:Request , res:Response , next:NextFunction) =>{
    res.status(200).json({
        success:true,
        message:"API working"
    })
})

app.use((req:Request , res:Response , next:NextFunction) =>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})


app.use(ErrorMiddleware)