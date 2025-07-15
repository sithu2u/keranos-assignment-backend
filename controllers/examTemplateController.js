import path from "path";
import { getPdfPageCount } from "../utils/getPdfPageCount.js";
import examTemplateService from "../providers/examTemplate/examTemplate.service.js";
import { validateObjectId } from "../utils/validateObjectId.js";
import { processFile } from "../utils/fileUploadProcessor.js";

// import { processFile, processMultipleFiles } from '../utils/fileProcessor.js';

// // For single file
// const result = await processFile(req.file, 'documents');

// // For multiple files
// const result = await processMultipleFiles(req.files, 'documents');

export const createExamTemplate = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const savedFile = await processFile(file, "exam_templates");

    const { title } = req.body;

    let pageCount = 1;
    const ext = path.extname(savedFile.originalname).toLowerCase();
    if (ext == ".pdf") pageCount = await getPdfPageCount(savedFile.path);

    const examTemplate = await examTemplateService.createExamTemplate({
      title: title,
      documentUrl: savedFile.url, // Local path or S3 URL
      status: "pending",
      pages: pageCount,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Exam Template created.",
      data: examTemplate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findAllExamTemplates = async (req, res) => {
  try {
    const examTemplates = await examTemplateService.findAllExamTemplates();
    res.json(examTemplates);
  } catch (err) {
    console.log("Error all exam templates:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete a users
export const softDeleteExamTemplates = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide an array of user IDs" });
  }

  try {
    const result = await examTemplateService.softDeleteExamTemplates(ids);

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No exam template found to delete" });
    }

    res.json({
      message: `${result.modifiedCount} exam template(s) have been deleted`,
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam template", error });
  }
};

export const findOneExamTemplate = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const result = await examTemplateService.findOneExamTemplate(req.params.id);
    if (!result) return res.status(404).json({ message: "Record not found" });
    const HOST = process.env.HOST;
    result.documentUrl = `${HOST}/${result.documentUrl}`;
    let regionMap;
    if (result.regions.length > 0) {
      regionMap = transformRegionsForFrontend(result.regions);
    }
    res.status(200).json({
      message: "Record Found",
      data: { ...result.toObject(), regions: regionMap },
    });
  } catch (err) {
    console.log("Error specific user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateExamTemplateInfo = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  const { title } = req.body;

  if (title.trim() == "") {
    return res.status(400).json({ message: "title required" });
  }

  try {
    const updated = await examTemplateService.updateExamTemplateInfo(
      req.params.id,
      title
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.log("Error restore user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRegion = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" });

  try {
    const rawRegions = req.body.regions; // the object with keys "0", "1", etc.

    const regions = [];

    for (const [pageStr, items] of Object.entries(rawRegions)) {
      if (!Array.isArray(items)) {
        console.warn(`Skipping key ${pageStr} — not an array:`, items);
        continue;
      }
      // const page = parseInt(pageStr);
      for (const region of items) {
        // now safe to iterate
        // console.log("region:", region);
        let optionsArray = [];
        if (
          typeof region.options === "string" &&
          region.options.trim().length > 0
        ) {
          const arrayWithSpaces = region.options.trim().split(",");
          optionsArray = arrayWithSpaces.map((item) => item.trim());
        }

        regions.push({
          regionLabel: region.label?.trim() || "", // assuming label is unique like "R1"
          type: region.type?.trim() || "",
          page: region.pageIndex ?? parseInt(pageStr),
          coordinates: {
            x: parseInt(region.x),
            y: parseInt(region.y),
            width: parseInt(region.width),
            height: parseInt(region.height),
          },
          options: optionsArray,
          correctAnswer: region.correctAnswer?.trim() || "",
          rubricAnswer: region.rubricAnswer?.trim() || "",
          points: region.points || 0,
        });
      }
    }
    // Update the document
    const updated = await examTemplateService.updateRegion(
      req.params.id,
      regions
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

function transformRegionsForFrontend(regions = []) {
  const result = {};

  regions.forEach((region, index) => {
    const page = region.page;
    if (!result[page]) {
      result[page] = [];
    }

    result[page].push({
      x: region.coordinates.x,
      y: region.coordinates.y,
      width: region.coordinates.width,
      height: region.coordinates.height,
      pageIndex: region.page,
      label: region.regionLabel,
      type: region.type,
      options: region.options.length > 0 ? region.options.join(",") : "",
      correctAnswer: region.correctAnswer,
      rubricAnswer: region.rubricAnswer,
      points: region.points,
    });
  });

  return result;
}
