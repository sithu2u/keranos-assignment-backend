import examTemplateService from "../providers/examTemplate/examTemplate.service.js";
import studentAnswerService from "../providers/examTemplate/studentAnswer.service.js";
import { validateObjectId } from "../utils/validateObjectId.js";

import { processMultipleFiles } from "../utils/fileUploadProcessor.js";
import { preprocessImage } from "../utils/preProcessingIamge.js";

import path from "path";
import { extractTextFromRegionsWithTesseract } from "../utils/extractTextFromRegionsWithTesseract.js";

export const findAllStudentAnswers = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" + req.params.id });

  try {
    const examTemplate = await examTemplateService.findOneExamTemplate(
      req.params.id
    );
    if (!examTemplate)
      return res.status(404).json({ message: "Record not found" });

    const result = await studentAnswerService.findAllStudentAnswers(
      req.params.id
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Error all users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadStudentAnswer = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request" + req.params.id });

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const result = await examTemplateService.findOneExamTemplate(req.params.id);
    if (!result) return res.status(404).json({ message: "Record not found" });

    const savedFiles = await processMultipleFiles(
      req.files,
      `student_answers/${req.params.id}`
    );

    const savedStudentAnswers = [];
    const outputFolderPath = `student_answers/${req.params.id}/processed`;

    for (const file of savedFiles) {
      //TODO check file is pdf , conver to image

      //now just only put single image
      const originalImagesUrl = [file.url];

      const processedImagesUrl = [];
      for (const imageFile of originalImagesUrl) {
        const processedImage = await preprocessImage(
          imageFile,
          outputFolderPath
        );
        processedImagesUrl.push(processedImage);
      }

      const studentAnswer = {
        examTemplate: req.params.id,
        createdBy: req.user._id,
        originalDocumentUrl: file.url,
        originalImagesUrl: originalImagesUrl,
        processedImagesUrl: processedImagesUrl,
        // originalName: file.originalname,
        // fileName: file.filename,
        // mimeType: file.mimetype,
        // size: file.size,
      };

      const saveStudentAnswer = await studentAnswerService.createStudentAnswer(
        studentAnswer
      );
      savedStudentAnswers.push(saveStudentAnswer);
    }

    res.status(201).json({
      message: "Student answer upload complete.",
      data: savedStudentAnswers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const ocrStudentAnswer = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request " });

  const { ids, resetFlag } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide an array of student answers" });
  }

  try {
    const examTemplate = await examTemplateService.findOneExamTemplate(
      req.params.id
    );
    if (!examTemplate)
      return res.status(404).json({ message: "Record not found" });

    if (!Array.isArray(examTemplate.regions)) {
      return res
        .status(400)
        .json({ message: "exam template regions are required" });
    }

    if (resetFlag === true) {
      console.log("reset call");
      //update student anster status to pending
      await studentAnswerService.updateStudentAnswers(ids, {
        status: "pending",
      });

      //remove exsiting ocr result
      await studentAnswerService.removeOcrResultByAnswerIds(ids);
    }

    const studentAnswers =
      await studentAnswerService.findSelectedStudentAnswersWithPendingStatus(
        req.params.id,
        ids
      );

    if (studentAnswers.length === 0)
      return res
        .status(404)
        .json({ message: "No record found to do ocr Request" });

    // for (const studentAnswer of studentAnswers) {
    const studentAnswer = studentAnswers[0];
    for (const answerUrl of studentAnswer.processedImagesUrl) {
      const fullImagePath = path.join(process.cwd(), answerUrl);

      const { results: ocrResult, studentId } =
        await extractTextFromRegionsWithTesseract(
          fullImagePath,
          examTemplate._id.toString(),
          studentAnswer._id.toString(),
          examTemplate.regions
        );
      const ocrAnswerResult = checkAnswer(examTemplate.regions, ocrResult);

      await studentAnswerService.updateStudentAnswer(studentAnswer._id, {
        status: "processed",
      });
      const saverst = await studentAnswerService.saveOcrStudentResult({
        templateId: examTemplate._id,
        answerId: studentAnswer._id,
        studentId:
          studentId && studentId !== "" ? studentId : "Student Id not found",
        ocrRegions: ocrAnswerResult,
      });
    }
    // }

    studentAnswer.status = "processed";

    res.json({
      studentAnswer: studentAnswer,
      ocrProcessTotal: ids.length,
      ocrPending: studentAnswers.length - 1,
      message: "Process complete",
    });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ message: "OCR failed", error: err.message });
  }
};

const checkAnswer = (regions, ocrResult) => {
  const studentAnswers = regions
    .map((region) => {
      const regionId = region._id.toString();
      const studentAnswer = ocrResult[regionId];
      // console.log(studentAnswer.text);
      if (studentAnswer === undefined) return null; // skip if no answer

      const isCorrect =
        studentAnswer.text.trim().toLowerCase() ===
        region.correctAnswer.trim().toLowerCase();
      const pointsAwarded = isCorrect ? region.points : 0;

      const result = {
        regionId: regionId,
        regionLabel: region.regionLabel,
        type: region.type,
        page: region.page,
        coordinate: {
          x: region["coordinates"].x,
          y: region["coordinates"].y,
          widht: region["coordinates"].width,
          height: region["coordinates"].height,
        },
        detectAnswer: studentAnswer.text,
        confidence: studentAnswer.confidence,
        isCorrect,
        pointsAwarded,
      };

      return result;
    })
    .filter(Boolean); // remove nulls

  return studentAnswers;
};

export const viewOcrResult = async (req, res) => {
  if (!validateObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid Request " });

  if (!validateObjectId(req.params.answerId))
    return res.status(400).json({ message: "Invalid Request " });

  try {
    const ocrResult = await studentAnswerService.findOcrResutByAnswerId(
      req.params.answerId
    );
    const studentAnswer = await studentAnswerService.findOneStudentAnswer(
      req.params.answerId
    );
    res.status(200).json({ ocrResult, studentAnswer });
  } catch (err) {
    console.log("Error specific:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
