import User from "../models/user.schema"
import asyncHandler from "../services/asynsHandler"
import customError from "../utils/customError"

export const cookieOption = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}


/*
@SIGNUP

*/

export const SignUp = asyncHandler(async(req,res)=>{
    const {name ,email, password} = req.body

    if(!(name || email || password)){
        throw new customError("all fileds required" , 400)
    }

    // existing user
    const existing  = await User.findOne({email})

    if(existing){
        throw new customError("user exist in database" , 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJwtToken()
    console.log(user)
    token.password = undefined

    res.cookie("token",token,cookieOption)

    res.status(200).json({
        success:true,
        token,
        user
    })
})