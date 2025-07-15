import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cv = require("@u4/opencv4nodejs");
export default cv;
