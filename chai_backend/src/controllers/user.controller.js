import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) =>{
    // get user details from frontend or postman
     // validations - not empty
    const {username, fullname, email, password} = req.body
    console.log("email", email)
    
    if(
        [fullname, username, email, password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    // check if user is alreday exsits with username or email
    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409, "User is alreday exists")
    }
    // details we want from user username, fullname, email, password, avatar, coverimage
    // check for imgaes and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }
    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }
    // create user object - create entry in db
    // remove password and refresh token from response
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowercase()
    })
    // check for user creation
    const CreatedUSer = await User.findById(user._id).select("-password -refreshToken")
    if(CreatedUSer){
        throw new ApiError(500, " Something went wrong")
    }
    // return res
    return res.status(201).json(
        new ApiResponse(200, CreatedUSer, "User Registered Successfully")
    )
})
export {registerUser}