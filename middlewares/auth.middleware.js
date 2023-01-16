import User from "../models/user.schema"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/asynsHandler"
import customError from "../utils/customError"
import config from "../config/index"

export const isLogedIn = asyncHandler( async(req,res,next)=>{
    let token;

    if(req.cookie.token || (req.headers.authorization && req.headers.authorization.startWith("Bearer"))){
        token = req.cookie.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new customError("Not authorized to access this route",401)
    }

    try {
        const decodeJwtPayload = JWT.verify(token,config.JWT_SECRET)
        req.user = await User.findById(decodeJwtPayload._id,"name email role")
        next()
    } catch (error) {
        throw new customError("Not authorized to access this route",401)
    }

})