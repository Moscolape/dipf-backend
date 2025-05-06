const JambScholarshipApplicant = require("../models/jambScholarshipApplicants");

exports.getApplicantsCountByState = async (req, res) => {
    try {
      const targetStates = ["Abia", "Anambra", "Imo", "Enugu", "Ebonyi"];
  
      // Aggregate count of applicants per state
      const stateCounts = await JambScholarshipApplicant.aggregate([
        {
          $match: {
            stateOfOrigin: { $in: targetStates },
          },
        },
        {
          $group: {
            _id: "$stateOfOrigin",
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Convert aggregation result to object for easier mapping
      const countsMap = stateCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
  
      // Ensure all target states are represented, even with 0
      const result = targetStates.map((state) => ({
        state,
        count: countsMap[state] || 0,
      }));
  
      res.status(200).json({
        message: "Applicants count by state fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching state analytics:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  