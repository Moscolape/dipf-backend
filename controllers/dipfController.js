const Member = require("../models/dipfMembers");

const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res
      .status(201)
      .json({ message: "Member created successfully", member: newMember });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error adding member", error: err.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error retrieving members", error: err.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error retrieving member", error: err.message });
  }
};

module.exports = { createMember, getMembers, getMemberById };
