// import cv from "@u4/opencv4nodejs";

// /**
//  * Deskew an image and save the result.
//  * @param {string} inputPath - Path to the input image
//  * @param {string} outputPath - Path to save the deskewed image
//  */
// export function deskewImage(inputPath, outputPath) {
//   const mat = cv.imread(inputPath);

//   if (!mat || mat.empty) {
//     throw new Error(`Cannot read image at: ${inputPath}`);
//   }

//   const gray = mat.channels > 1 ? mat.bgrToGray() : mat;

//   // Threshold to binary
//   const binary = gray.threshold(0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

//   // Compute image moments
//   const moments = binary.moments();

//   if (Math.abs(moments.mu02) < 1e-2) {
//     console.log(" No skew detected, saving original image.");
//     cv.imwrite(outputPath, mat);
//     return;
//   }

//   const skew = moments.mu11 / moments.mu02;
//   const rows = mat.rows;
//   const cols = mat.cols;

//   // Affine transform to deskew
//   const M = new cv.Mat(
//     [
//       [1, skew, -0.5 * cols * skew],
//       [0, 1, 0],
//     ],
//     cv.CV_64F
//   );

//   const deskewed = mat.warpAffine(
//     M,
//     new cv.Size(cols, rows),
//     cv.INTER_LINEAR,
//     cv.BORDER_CONSTANT,
//     new cv.Vec(255, 255, 255) // white background
//   );

//   cv.imwrite(outputPath, deskewed);
//   console.log("Deskewed image saved to:", outputPath);
// }
