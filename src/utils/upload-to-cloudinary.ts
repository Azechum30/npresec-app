import {v2 as cloudinary} from 'cloudinary';
import { env } from "@/lib/server-only-actions/validate-env";

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
	secure: true,
})

export const uploadToCloudinary = async(imageFile: File, sub:string) => {
	const bytes = await imageFile.arrayBuffer();
	const buffer = Buffer.from(bytes);

	const uploadResponse:any = await new Promise((resolve, reject) => {
		cloudinary.uploader.upload_stream({
			folder: `npresec/${sub}/`,
			public_id: `${sub}/${imageFile.name}`,
			overwrite: true,
			invalidate: true,
		},(err, result)=>{
			if(err) reject(err)
			resolve(result)
		}).end(buffer)
	});

	if(!uploadResponse.secure_url) throw new Error('Failed to upload to cloudinary');

	return uploadResponse.secure_url as string;
};