// visionClient.js
import vision from "@google-cloud/vision";

export const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: "./" + process.env.GOOGLE_VISION_AI_KEY_FILE,
});
