import Product from "../models/product.schema.js";
import formidable from "formidable";
import fs from "fs";
import mongoose from "mongoose";
import { s3FillUpload, deleteFile } from "../services/imageUpload"
import asyncHandler from "../services/asynsHandler"
import customError from "../utils/customError";
import config from "../config/index"

/*
@ADD_PRODUCT
description controller used for creating new product
description only admin can create token
description use AWS s3 Bucket for upload image
return product object
*/


export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true
    })

    form.parse(req, async function (err, fields, files) {
        try {
            if (err) {
                throw new customError(err.message || "something went wrong", 500)
            }

            let productId = new mongoose.Types.ObjectId()
                .toHexString()
            // check for fileds
            if (!fields.name ||
                !fields.price ||
                !fields.description ||
                !fields.collectionId) {
                throw new customError("something went wrong", 500)
            }

            // handling image
            let imgArrayResponse = Promise.all(
                Object.keys(files).map(async (fileKey, index) => {
                    const element = files[fileKey]

                    const data = fs.readFileSync(element.filepath)
                    const upload = await s3FillUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productId}/photo_${index + 1}`,
                        body: data,
                        contentType: element.mimetype
                    })
                    return {
                        secure_url: upload.Location
                    }
                })
            )

            let imgArray = await imgArrayResponse;

            const product = await Product.create({
                _id: productId,
                photos:imgArray,
                ...fields
            })

            if(!product){
                throw new customError("product was not created",400)
            }

            res.status(200).json({
                success:true,
                product
            })
        } catch (error) {
            res.status(401).json({
                success:false,
                message: error.message || "something went wrong"
            })
        }
    })
})