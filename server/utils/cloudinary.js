//Environment Setup (dotenv)
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
//connect to cloudinary
const cloudinary = require("cloudinary").v2


// console.log("cloud_name:", process.env.CLOUDINARY_CLOUD_NAME)
// console.log("api_key:", process.env.CLOUDINARY_API_KEY)


// verifcation for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// fileBuffer as input: buffer: raw binary data of the image
const uploadImage = async (fileBuffer) => {
    return new Promise((resolve, reject) => {

        //upload via stream
        cloudinary.uploader.upload_stream(
            { folder: "devcircle" },
            (error, result) => {
                if(error) reject(error)
                else resolve(result.secure_url)
            }
        ).end(fileBuffer)
    })
}

module.exports = { uploadImage }