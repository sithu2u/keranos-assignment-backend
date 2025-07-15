import { PDFDocument } from "pdf-lib";
import fs from "fs";

export const getPdfPageCount = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(buffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error("Error reading PDF:", error);
    return 0;
  }
};
