
import { Document, model, Schema } from "mongoose";

interface FaqItem extends Document{
    question:string,
    answer:string,
}
interface Category extends Document{
    title:string,
}

interface Layout extends Document{
    type:string,
    faq:FaqItem[],
    categories:Category[],
    content: string, // For Terms, Privacy, etc.
}

const faqSchema = new Schema<FaqItem>({
    question:{type:String},
    answer:{type:String},
})

const categorySchema = new Schema<Category>({
    title:{type:String},
})



const layoutSchema = new Schema<Layout>({
    type:{type:String},
    faq:[faqSchema],
    categories:[categorySchema],
    content: { type: String },
})

const LayoutModel =model<Layout>('Layout' , layoutSchema)

export default LayoutModel
