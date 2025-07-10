import multer from "multer";
import fs from "fs";
import path from "path";

//  Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // safer with recursive
}

//  Configure Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname); // ⬅ safer extension parsing
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

//  Export middleware
export const upload = multer({ storage });
