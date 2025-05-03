const { validationResult } = require("express-validator");
const JambScholarshipApplicant = require("../models/jambScholarshipApplicants");

exports.registerJambScholarshipApplicant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Jamb slip file is missing!" });
  }

  try {
    const jambSlip = req.file.path.replace("\\", "/");

    const newApplicant = new JambScholarshipApplicant({
      ...req.body,
      jambSlip
    });

    await newApplicant.save();
    res.status(201).json({
      message: "JAMB Scholarship applicant registered successfully",
      applicant: newApplicant,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
