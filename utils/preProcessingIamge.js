import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";
import { analyzeSkew } from "./analyzeDeskew.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename));

// Ensure target folder exists
const ensureFolder = async (folderPath) => {
  const safeFolderPath = folderPath.replace(/^\/+/, "");
  const fullPath = path.join(__dirname, "..", "uploads", safeFolderPath);
  await fs.promises.mkdir(fullPath, { recursive: true });
  return fullPath;
};

/**
 * Preprocesses an image to improve OCR accuracy.
 *
 * reads an image from `inputPath`,
 * applies preprocessing steps
 * image to `outputPath`.
 *
 * @param {string} inputPath - Path to the original input image.
 * @param {string} outputPath - Path where the processed image will be saved.
 *
 * @return {string}
 */
export const preprocessImage = async (inputPath, outputPath) => {
  const absoluteInputPath = path.join(__dirname, "..", inputPath);
  const inputFileName = path.basename(inputPath);

  const saveFolder = await ensureFolder(outputPath);
  const outputPathUrl = path.join("uploads", outputPath, inputFileName);
  const outputFullPath = path.join(saveFolder, inputFileName);

  const tempPath = path.join(saveFolder, "temp-" + inputFileName);

  const { skewAngle, needDeskew } = await analyzeSkew(absoluteInputPath);
  // console.log(absoluteInputPath);
  try {
    // Step 1: Preprocessing
    await sharp(absoluteInputPath)
      .rotate() // auto-orient
      .resize({ width: 1920 }) // max width
      .grayscale()
      .blur(0.3)
      .linear(1.2, -20) // contrast
      .toFile(tempPath);

    // Step 2: Deskew (if needed)
    if (needDeskew)
      await sharp(tempPath).rotate(-skewAngle).toFile(outputFullPath);

    // Cleanup temp file
    await fs.promises.unlink(tempPath);

    // console.log("image saved:", outputPathUrl);
    return outputPathUrl;
  } catch (err) {
    console.error("Image preprocessing failed:", err.message);
    throw err;
  }
};

// preprocessImage(
//   "uploads/student_answers/687153c72a63c5eb6fb25133/1752403622779-690968322-2.jpg",
//   "student_answers/processed"
// );
