import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadImage(file: File, folder = "javiermaldonado") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) => {
        if (err || !result) reject(err || new Error("Upload failed"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(buffer);
  });
}

export async function uploadRaw(file: File, folder = "javiermaldonado/resources") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "raw" }, (err, result) => {
        if (err || !result) reject(err || new Error("Upload failed"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(buffer);
  });
}
