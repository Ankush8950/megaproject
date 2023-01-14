import User from "../models/user.schema"
import asyncHandler from "../services/asynsHandler"
import customError from "../utils/customError"
import mailHelper from "../utils/mailHelper"

export const cookieOption = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}


/*
@SIGNUP
description user signup controller
parameters name, email, password
return user object

*/

export const SignUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!(name || email || password)) {
        throw new customError("all fileds required", 400)
    }

    // existing user
    const existing = await User.findOne({ email })

    if (existing) {
        throw new customError("user exist in database", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJwtToken()
    console.log(user)
    token.password = undefined

    res.cookie("token", token, cookieOption)

    res.status(200).json({
        success: true,
        token,
        user
    })
})



/*
@SIGN IN
description user Sign In controller
parameters  email, password
return user object

*/


export const login = asyncHandler(async (req,res)=>{
    const {email, password} = req.body

    if(!(email || password)){
        throw new customError("please fill the details", 400)
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new customError("invalid credentials",400)
    }

    const matchedPassword = await user.comparePassword(password)

    if(matchedPassword){
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token",token,cookieOption)

        return res.status(200).json({
            success:true,
            token,
            user
        })
    }
    throw new customError("invalid credentials password",400)
})




/*
@Logout
description user logOut In controller
parameters  email, password
return success message

*/

export const logout = asyncHandler(async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message: "Logged Out"
    })
})



/*
@forgot password
description user will submit email and we will generate token
parameters  email
return success message, email send
*/

export const forgotPassword = asyncHandler(async (req,res)=>{
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new customError("user not found",404)
    }

    const resetToken = user.generateForgetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${rep.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

    const text = `Your password reset url is \n\n${resetUrl}\n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: "password reset email for web",
            text: text,
        })

        req.status(200).json({
            success:true,
            message: `email send to ${user.email}`
        })
    } catch (err) {
        user.forgotPasswordToken = undefined,
        user.forgotPasswordExpiry = undefined

       await user.save({validateBeforeSave: false})

       throw new customError(err.message || "email send failure",500)
    }
})