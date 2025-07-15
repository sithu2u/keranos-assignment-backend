import multer from "multer";
import path from "path";

// Use memory storage for further processing (e.g., sharp, manual saving)
const storage = multer.memoryStorage();

// Allowed extensions and MIME types
const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];
const allowedMimeTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
  "image/webp",
];

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(file.mimetype);
  const isExtAllowed = allowedExtensions.includes(ext);
  //   const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
  // && isMimeAllowed
  if (isExtAllowed) {
    cb(null, true); // ✅ Accept file
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, JPG, JPEG, PNG, and WEBP files are allowed"
      ),
      false
    );
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Usage variants
const uploadSingle = upload.single("file"); // for single file
const uploadMultiple = upload.array("files", 50); // up to 50 files
// const uploadFields = upload.fields([
//   { name: "field1", maxCount: 1 },
//   { name: "field2", maxCount: 1 },
//   { name: "field3", maxCount: 1 },
// ]);

export { upload, uploadSingle, uploadMultiple };
//   uploadFields,
