import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadPDF(filePath){

  try{

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // 🔥 IMPORTANT for PDF
      folder: "hisabi-reports"
    })

    // delete local file after upload
    fs.unlinkSync(filePath)

    return result.secure_url

  } catch(err){
    console.error("Cloudinary Upload Error:", err)
    throw err
  }
}