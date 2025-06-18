import fs from "fs";
import path from "path";

const avatarDir = path.join("public", "avatar");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}


import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/avatar"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)  // to avoid duplicates
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }  // 2 MB max
});
