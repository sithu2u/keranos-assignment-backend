import OcrResult from "../../models/ocrResultModel.js";
import StudentAnswer from "../../models/studentAnswerModel.js";

const selectQueryOptions = "-__v";

const createStudentAnswer = async (data) => {
  const studentAnswer = new StudentAnswer(data);
  return await studentAnswer.save();
};

const findAllStudentAnswers = async (exam_id) => {
  return await StudentAnswer.find({
    deleted: false,
    examTemplate: exam_id,
  });
};

const findSelectedStudentAnswersWithPendingStatus = async (
  exam_id,
  studentAnswerIds
) => {
  return await StudentAnswer.find({
    deleted: false,
    examTemplate: exam_id,
    status: "pending",
    _id: { $in: studentAnswerIds },
  });
};

const updateStudentAnswer = async (answerId, value) => {
  return await StudentAnswer.findByIdAndUpdate(answerId, value, { new: true });
};

const updateStudentAnswers = async (ids, value) => {
  return await StudentAnswer.updateMany({ _id: { $in: ids } }, { $set: value });
};

const findOneStudentAnswer = async (id) => {
  return await StudentAnswer.findOne({ _id: id });
};

const saveOcrStudentResult = async (data) => {
  const ocrResult = new OcrResult(data);
  return await ocrResult.save();
};

const removeOcrResultByAnswerIds = async (answerIds) => {
  return await OcrResult.deleteMany({ answerId: { $in: answerIds } });
};

const findOcrResutByAnswerId = async (answerId) => {
  return await OcrResult.findOne({
    answerId: answerId,
  });
};

export default {
  createStudentAnswer,
  findAllStudentAnswers,
  findSelectedStudentAnswersWithPendingStatus,
  saveOcrStudentResult,
  updateStudentAnswer,
  updateStudentAnswers,
  removeOcrResultByAnswerIds,
  findOcrResutByAnswerId,
  findOneStudentAnswer,
};
