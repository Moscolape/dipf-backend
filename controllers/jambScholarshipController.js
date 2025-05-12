const { validationResult } = require("express-validator");
const JambScholarshipApplicant = require("../models/jambScholarshipApplicants");

exports.registerJambScholarshipApplicant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.files || !req.files.jambSlip || !req.files.passport) {
    return res
      .status(400)
      .json({ message: "One or more required files are missing!" });
  }

  try {
    const jambSlip = req.files.jambSlip[0].path.replace(/\\/g, "/");
    const passport = req.files.passport[0].path.replace(/\\/g, "/");
    // const oLevelSlip = req.files.oLevelSlip[0].path.replace(/\\/g, "/");

    const newApplicant = new JambScholarshipApplicant({
      ...req.body,
      jambSlip,
      passport,
      //   oLevelSlip,
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

exports.getAllJambScholarshipApplicants = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;
  const stateOfOrigin = req.query.stateOfOrigin;
  const jambExamState = req.query.jambExamState;

  let query = {};

  if (stateOfOrigin) {
    query.stateOfOrigin = stateOfOrigin;
  }

  if (jambExamState) {
    query.jambExamState = jambExamState;
  }

  try {
    const [total, applicants] = await Promise.all([
      JambScholarshipApplicant.countDocuments(query),
      JambScholarshipApplicant.find(query)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      message: "JAMB scholarship applicants fetched successfully",
      applicants,
      totalItems: total,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getJambScholarshipApplicantById = async (req, res) => {
  try {
    const applicant = await JambScholarshipApplicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.status(200).json({
      message: "Applicant fetched successfully",
      applicant,
    });
  } catch (error) {
    console.error("Error fetching applicant:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
