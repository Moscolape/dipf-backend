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

exports.getApplicantsCountBySex = async (req, res) => {
  try {
    const sexCounts = await JambScholarshipApplicant.aggregate([
      {
        $group: {
          _id: "$sex",
          count: { $sum: 1 },
        },
      },
    ]);

    const countsMap = sexCounts.reduce((acc, item) => {
      acc[item._id?.toLowerCase()] = item.count;
      return acc;
    }, {});

    const result = [
      { sex: "Males", count: countsMap["male"] || 0 },
      { sex: "Females", count: countsMap["female"] || 0 },
    ];

    res.status(200).json({
      message: "Applicants count by sex fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching sex analytics:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getApplicantsCountByJambScoreRange = async (req, res) => {
  try {
    const scoreRanges = [
      { label: "(250-299)", min: 250, max: 299 },
      { label: "(300-349)", min: 300, max: 349 },
      { label: "(350-400)", min: 350, max: 400 },
    ];

    const pipeline = scoreRanges.map(({ min, max, label }) => ({
      $facet: {
        [label]: [
          { $match: { jambScore: { $gte: min, $lte: max } } },
          { $count: "count" },
        ],
      },
    }));

    // Combine all facets into one
    const result = await JambScholarshipApplicant.aggregate([
      {
        $facet: {
          "(250-299)": [
            { $match: { jambScore: { $gte: 250, $lte: 299 } } },
            { $count: "count" },
          ],
          "(300-349)": [
            { $match: { jambScore: { $gte: 300, $lte: 349 } } },
            { $count: "count" },
          ],
          "(350-400)": [
            { $match: { jambScore: { $gte: 350, $lte: 400 } } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = Object.entries(result[0]).map(([range, value]) => ({
      range,
      count: value[0]?.count || 0,
    }));

    res.status(200).json({
      message: "Applicants count by JAMB score range fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching JAMB score range analytics:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
