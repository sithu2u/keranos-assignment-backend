// analyzeDeskew.js
import { visionClient } from "./googleVisionClient.js";

/**
 * Analyzes an image and returns skew angle and deskew suggestion.
 * @param {string} filePath - Path to image file.
 * @returns {Promise<{ skewAngle: number, needDeskew: boolean }>}
 */
export async function analyzeSkew(filePath) {
  const [result] = await visionClient.documentTextDetection(filePath);
  const fullText = result.fullTextAnnotation;

  if (!fullText || !fullText.pages.length) {
    throw new Error("No text detected in image");
  }

  const page = fullText.pages[0];
  const block = page.blocks?.[0];

  if (!block || !block.boundingBox?.vertices) {
    throw new Error("No bounding box found in image");
  }

  const angle = calculateSkewAngle(block.boundingBox.vertices);
  const needDeskew = Math.abs(angle) > 2;

  return {
    skewAngle: parseFloat(angle.toFixed(2)),
    needDeskew,
  };
}

/**
 * Calculates skew angle from bounding box vertices.
 * @param {Array<{x: number, y: number}>} vertices
 * @returns {number}
 */
function calculateSkewAngle(vertices) {
  const [topLeft, topRight] = vertices;
  const dx = topRight.x - topLeft.x;
  const dy = topRight.y - topLeft.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
