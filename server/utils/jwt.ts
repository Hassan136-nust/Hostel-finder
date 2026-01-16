import { IUser } from "../models/user.model";
import { redis } from "../config/redis";
require('dotenv').config();
import { Response } from 'express';

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '259200', 10); // 3 days in seconds
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '604800', 10); // 7 days in seconds

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    redis.set(user._id.toString(), JSON.stringify(user), "EX", refreshTokenExpire);

    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        accessTokenOptions.sameSite = 'none'; 
        
        refreshTokenOptions.secure = true;
        refreshTokenOptions.sameSite = 'none'; 
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    console.log("Tokens sent for user:", user.email); // Debug log

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};