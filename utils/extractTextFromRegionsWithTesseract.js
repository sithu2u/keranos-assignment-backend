import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import Tesseract from "tesseract.js";

const outputBaseDir = "uploads/ocr_regions";

export const extractTextFromRegionsWithTesseract = async (
  imagePath,
  examTemplateId,
  studentAnswerId,
  regions = []
) => {
  const results = {};
  const studentId = "";
  const imageBuffer = await fs.readFile(imagePath);

  for (const region of regions) {
    const { _id, coordinates } = region;

    const regionId = _id.toString();

    // 1. Crop and process image
    const croppedBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.round(coordinates.x),
        top: Math.round(coordinates.y),
        width: Math.round(coordinates.width),
        height: Math.round(coordinates.height),
      })
      .grayscale()
      .toBuffer();

    // 2. Save image for review
    const saveDir = path.join(outputBaseDir, examTemplateId, studentAnswerId);
    const savePath = path.join(saveDir, `${regionId}.jpg`);

    await fs.mkdir(saveDir, { recursive: true }); // Ensure directory exists
    await fs.writeFile(savePath, croppedBuffer);

    // 3. OCR process
    const { data } = await Tesseract.recognize(croppedBuffer, "eng");

    if (region.type == "qr_code") {
      studentId = data.text.trim();
    } else {
      results[regionId] = {
        text: data.text.trim(),
        confidence: data.confidence,
        imagePath: savePath, // optional: store path for later use
      };
    }
  }

  return { results, studentId };
};
