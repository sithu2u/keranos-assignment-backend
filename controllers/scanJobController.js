import ScanJob from "../models/ScanJobModel.js";
import path from "path";

export const createScanJob = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one file must be uploaded" });
    }

    const filePaths = files.map((file) => file.path).join(",");

    const { title } = req.body;

    const newJob = await ScanJob.create({
      title: "job_" + Date.now(),
      documentUrl: filePaths, // Local path or S3 URL
      status: "pending",
      templateId: "TEMPLATE_ID_" + Date.now(),
      pages: 0,
    });

    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
