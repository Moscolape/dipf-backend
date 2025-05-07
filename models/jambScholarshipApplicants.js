const mongoose = require("mongoose");

const jambScholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ["Male", "Female"], required: true },
  phone: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  stateOfOrigin: { type: String, required: true },
  lgaOfOrigin: { type: String, required: true },
  jambExamState: { type: String, required: true },
  secondarySchool: { type: String, required: true },
  schoolState: { type: String, required: true },
  schoolLga: { type: String, required: true },
  jambScore: { type: Number, required: true },
  firstChoice: { type: String, required: true },
  secondChoice: { type: String, required: true },
  jambSlip: { type: String, required: true },
  passport: { type: String, required: true },
//   oLevelSlip: { type: String, required: true },
}, { timestamps: true });

const JambScholarshipApplication = mongoose.model("JambScholarshipApplication", jambScholarshipSchema);
module.exports = JambScholarshipApplication;
