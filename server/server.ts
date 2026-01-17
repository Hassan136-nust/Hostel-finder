import dotenv from 'dotenv'
import {app} from './app'
import connectDB from "./config/db"
import {v2 as cloudinary} from 'cloudinary'

dotenv.config()

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY
})

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();