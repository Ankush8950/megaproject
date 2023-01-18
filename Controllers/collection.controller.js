import Collection from "../models/collection.schema"
import asyncHandler from "../services/asynsHandler"
import customError from "../utils/customError"

/*
@CREATE_COLLECTION
description check for token and poplute req.user 
parameters  
return user object
*/

export const createCollection = asyncHandler (async (req,res)=>{
    const {name} = req.body

    if(!name){
        throw new customError("collection name is required",400)
    }

    const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success:true,
        message: "collection created success",
        collection
    })
})


export const updateCollection = asyncHandler(async(req,res)=>{
    // existing value to be update
    const {id:collectionId} = req.params
    // new value to update
    const {name} = req.body

    if(!name){
        throw new customError("collection name is required",400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name
        },
        {
            new:true,
            runValidators:true
        }
    )

    if(!updatedCollection){
        throw new customError("collection not found",400)
    }

    res.status(200).json({
        success:true,
        message: "collection update successfull",
        updatedCollection
    })
})


export const deleteCollection = asyncHandler(async(req,res)=>{
    const {id: collectionId} = req.params
    const deletedCollection = await Collection.findByIdAndDelete(
        collectionId,

    )

    if(!deletedCollection){
        throw new customError("collection not found",400)
    }

    deletedCollection.remove()

    res.status(200).json({
        success:true,
        message: "collection deleted successfull"
    })
})


export const getAllCollection = asyncHandler(async(req,res)=>{
    const collection = await Collection.find()

    if(!collection){
        throw new customError("collection not found",400)
    }

    res.status(200).json({
        success:true,
        collection
    })
})