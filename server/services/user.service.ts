import { NextFunction, Response , Request } from "express"
import {redis} from "../config/redis"
import userModel from "../models/user.model";
import jwt from "jsonwebtoken";

export const getUserById = async(id:string , res:Response)=>{
    const userJson = await redis.get(id);
    if (userJson){
        const user = JSON.parse(userJson);
        
        const accessToken = jwt.sign(
            { id: user._id }, 
            process.env.ACCESS_TOKEN as string,
            { expiresIn: '3d' }
        );
        
        res.status(200).json({
            success: true,
            user,
            accessToken, 
        });
    } else {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
}

export const getAllUsersService = async(res:Response)=>{
    const users = await userModel.find().sort({createdAt:-1});
    res.status(200).json({
        success: true,
        users,
    });
}

export const updateUserRoleService = async(res:Response , id:string , role:string)=>{
    const users = await userModel.findByIdAndUpdate(id , {role} , { new : true});
    res.status(200).json({
        success: true,
        users,
    });
}

export const getHostelRequestsService = async (res: Response) => {
    const users = await userModel.find({ hostelRequestStatus: "pending" }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        users,
    });
};