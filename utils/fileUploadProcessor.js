import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename));

// Ensure target folder exists
const ensureFolder = async (folderPath) => {
  const safeFolderPath = folderPath.replace(/^\/+/, ""); // prevent absolute override
  const fullPath = path.join(__dirname, "..", "uploads", safeFolderPath);
  await fs.promises.mkdir(fullPath, { recursive: true });
  return fullPath;
};

// Generate unique file name
const generateUniqueFileName = (file) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase();
  const name = `${uniqueSuffix}-${file.originalname}`;
  return { name, ext };
};

// Save a single file to disk
const processFile = async (file, folderPath) => {
  const fileBuffer = file.buffer;
  const saveFolderPath = await ensureFolder(folderPath);

  const { name: uniqueFileName, ext } = generateUniqueFileName(file);
  const absolutePath = path.join(saveFolderPath, uniqueFileName);
  const relativeUrl = path.join("uploads", folderPath, uniqueFileName);

  await fs.promises.writeFile(absolutePath, fileBuffer);

  return {
    originalname: file.originalname,
    filename: uniqueFileName,
    path: absolutePath,
    url: relativeUrl,
    ext: ext,
  };
};

// Handle multiple files from multer.fields()
const processMultipleFiles = async (filesObject, folderPath) => {
  const results = [];

  for (const key in filesObject) {
    const file = filesObject[key]; // Multer stores each field as an array
    // results[key] = await processFile(file, folderPath);
    const resultFile = await processFile(file, folderPath);
    results.push(resultFile);
  }

  return results;
};

// Remove a previously saved file
const removeFile = async (relativePath) => {
  const filePath = path.join(__dirname, "..", relativePath);
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error("Remove file error:", error.message);
  }
};

export { processFile, processMultipleFiles, removeFile };
