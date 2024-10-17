import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { Request } from "express";

interface CloudinaryParams {
  folder?: string;
  allowed_formats?: string[];
  public_id?: (req: Request, file: Express.Multer.File) => string;
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpeg", "png", "jpg"],
    public_id: (req: Request, file: Express.Multer.File) =>
      Date.now() + "-" + file.originalname,
  } as CloudinaryParams,
});

const upload = multer({ storage });

export default upload;
