import ExamTemplate from "../../models/examTemplateModel.js";

const selectQueryOptions = "-__v";

const createExamTemplate = async (data) => {
  const examTemplate = new ExamTemplate(data);
  return await examTemplate.save();
};

const findAllExamTemplates = async () => {
  //   return await ExamTemplate.find({ deleted: false }).sort("createdAt");
  return await ExamTemplate.find({ deleted: false })
    .populate("createdBy", "name")
    .sort("createdAt");
};

const findOneExamTemplate = async (id) => {
  //   return await ExamTemplate.find({ deleted: false }).sort("createdAt");
  return await ExamTemplate.findById(id)
    .populate("createdBy", "name")
    .sort("createdAt");
};

const softDeleteExamTemplates = async (ids) => {
  return await ExamTemplate.updateMany(
    { _id: { $in: ids } },
    { $set: { deleted: true } }
  );
};

const updateRegion = async (id, regions) => {
  return await ExamTemplate.findByIdAndUpdate(id, { regions }, { new: true });
};

const updateExamTemplateInfo = async (id, title) => {
  return await ExamTemplate.findByIdAndUpdate(id, { title }, { new: true });
};

export default {
  createExamTemplate,
  findAllExamTemplates,
  softDeleteExamTemplates,
  findOneExamTemplate,
  updateRegion,
  updateExamTemplateInfo,
};
