import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File is uploaded", response.url)
        return response;
    } catch (error) {
        // remove the saved temporary file 
        // fs is used to interact with the file system on the server
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}