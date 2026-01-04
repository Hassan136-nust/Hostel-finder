import { NextFunction, Response , Request } from "express"
import {redis} from "../config/redis"
import userModel from "../models/user.model";

export const getUserById = async(id:string , res:Response)=>{
    const userJson =await redis.get(id);
    if (userJson){
        const user = JSON.parse(userJson)
        res.status(201).json({
            status:true,
            user,
        })
    }
}



export const getAllUsersService = async(res:Response)=>{
    const users =await userModel.find().sort({createdAt:-1});
        res.status(201).json({
            status:true,
            users,
        })
}


export const updateUserRoleService = async(res:Response , id:string , role:string)=>{
    const users =await userModel.findByIdAndUpdate(id , {role} , { new : true});
        res.status(201).json({
            status:true,
            users,
        })
}