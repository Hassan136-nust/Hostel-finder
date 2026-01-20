
import cloudinary from 'cloudinary'
import { CatchAsyncError } from '../middlewares/CatchAsyncErrorMiddleware'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import LayoutModel from '../models/layout.model'

export const createLayout= CatchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
    try {
        const {type} =req.body;
        const isTypeExists = await LayoutModel.findOne({type})

        if(isTypeExists){
        return (new ErrorHandler(`${type} already exist`,500))
        }


        if(type === "FAQ"){
            const {faq}= req.body;
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return{
                        question:item.question,
                        answer:item.answer,
                    }
                })
            )
            await LayoutModel.create({type:"FAQ",faq:faqItems})
        }


         if(type === "Categories"){
            const {categories}= req.body;
            const categoriesItems = await Promise.all(
                categories.map(async(item:any)=>{
                    return{
                        title:item.title
                    }
                })
            )
            await LayoutModel.create({type:"Categories",categories:categoriesItems})
        }

        if(type === "Terms" || type === "Privacy"){
            const {content} = req.body;
            await LayoutModel.create({type, content})
        }

        res.status(200).json({
            success:true,
            message:"Layout created successfully"
        })

    } catch (error:any) {
        next(new ErrorHandler(error.message,500))
    }
})

export const editLayout = CatchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
    try {
        const {type} = req.body;

        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )
            
            const faqData = await LayoutModel.findOne({ type: "FAQ" });
            
            if (!faqData) {
                await LayoutModel.create({ type: "FAQ", faq: faqItems });
            } else {
                await LayoutModel.findByIdAndUpdate(faqData._id, { type: "FAQ", faq: faqItems });
            }
        }

        if(type === "Categories"){
            const {categories} = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                        title: item.title
                    }
                })
            )
            
            const categoriesData = await LayoutModel.findOne({ type: "Categories" });
            
            if (!categoriesData) {
                await LayoutModel.create({ type: "Categories", categories: categoriesItems });
            } else {
                await LayoutModel.findByIdAndUpdate(categoriesData._id, { type: "Categories", categories: categoriesItems });
            }
        }

        if(type === "Terms" || type === "Privacy"){
            const {content} = req.body;
            const data = await LayoutModel.findOne({type});
            if(!data){
                await LayoutModel.create({type, content});
            } else {
                await LayoutModel.findByIdAndUpdate(data._id, {type, content});
            }
        }

        res.status(200).json({
            success:true,
            message:"Layout updated successfully"
        })

    } catch (error:any) {
        next(new ErrorHandler(error.message,500))
    }
})

export const getLayout = CatchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
    try {
        const type = req.query.type || req.body?.type;        
        const layout = await LayoutModel.findOne({type})

         res.status(200).json({
            success:true,
            layout
        })

    }catch (error:any) {
        next(new ErrorHandler(error.message,500))
    }
})
