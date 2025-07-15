// visionClient.js
import vision from "@google-cloud/vision";

export const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: "./arboreal-logic-465918-p7-31aabe071691.json",
});
