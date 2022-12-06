import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"please provide a product name"],
            trim:true,
            maxLength:[120,"product should be a max 120 characters"],
        },
        price:{
            type:Number,
            required:[true,"please provide product price"],
            maxLength:[5,"product price should not be more than 5 digits"]
        },
        discription:{
            type: String,

        },
        photos:[
            {
                secure_url:{
                    type:String,
                    required:true
                }
            }
        ],
        stock:{
            type:String,
            default:0
        },
        sold:{
            type:Number,
            default:0
        },
        collectionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Collection"
        }
    },
    {
        timestamps:true
    }

)

export default mongoose.model("Product",productSchema)