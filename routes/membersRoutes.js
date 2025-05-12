const express = require("express");
const {
  createMember,
  getMembers,
  getMemberById,
} = require("../controllers/dipfController");
const router = express.Router();

router.post("/members", createMember);

router.get("/members", getMembers);

router.get("/members/:id", getMemberById);

module.exports = router;
