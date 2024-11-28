import {Video} from "../models/video.model.js"
import {asyncHandler} from "../util/asyncHandler.js"
import {ApiError} from "../util/ApiError.js"
import {uploadOnCloudinary} from "../util/cloudinary.js"
import {ApiResponse} from "../util/ApiResponse.js"

const publishAVideo = asyncHandler(async(req, res)=>{
    const owner = req?.user?._id;
    const {title, description, isPublished } = req.body

    if (!title || !description || !isPublished){
        throw new ApiError(400,"Video details are required")

    }

    if(!owner){
        throw new ApiError(400,"Unauthorized")
    }

    const videoFile = req.files.videoFile
    const thumbnail =  req.files.thumbnail

    const uploadedVideoFile = await uploadOnCloudinary(videoFile[0].path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail[0].path)

    const video = await Video.create(
        {
            videoFile :uploadedVideoFile.url,
            thumbnail : uploadedThumbnail.url,
            title : title,
            description: description ,
            duration :uploadedVideoFile.duration ,
            views : 0 ,
            isPublished: isPublished ,
            owner : owner
        })

        res
        .status(200)
        .json(new ApiResponse(200, video, "Video is published"))
})

export {publishAVideo}