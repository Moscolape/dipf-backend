const JambScholarshipApplicant = require("../models/jambScholarshipApplicants");

exports.getApplicantsCountByGeopoliticalZones = async (req, res) => {
  try {
    const zoneMap = {
      NorthCentral: [
        "Benue",
        "Kogi",
        "Kwara",
        "Nasarawa",
        "Niger",
        "Plateau",
        "FCT",
      ],
      NorthEast: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
      NorthWest: [
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Sokoto",
        "Zamfara",
      ],
      SouthEast: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
      SouthSouth: [
        "Akwa Ibom",
        "Bayelsa",
        "Cross River",
        "Delta",
        "Edo",
        "Rivers",
      ],
      SouthWest: ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"],
    };

    // Flatten the zoneMap to create a reverse lookup: state -> zone
    const stateToZone = {};
    for (const [zone, states] of Object.entries(zoneMap)) {
      states.forEach((state) => {
        stateToZone[state] = zone;
      });
    }

    // Aggregate all applicants grouped by stateOfOrigin
    const stateCounts = await JambScholarshipApplicant.aggregate([
      {
        $group: {
          _id: "$stateOfOrigin",
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize counts per zone
    const zoneCounts = Object.keys(zoneMap).reduce((acc, zone) => {
      acc[zone] = 0;
      return acc;
    }, {});

    // Map state counts to zone counts
    stateCounts.forEach(({ _id, count }) => {
      const zone = stateToZone[_id];
      if (zone) {
        zoneCounts[zone] += count;
      }
    });

    // Format result
    const result = Object.entries(zoneCounts).map(([zone, count]) => ({
      zone,
      count,
    }));

    res.status(200).json({
      message: "Applicants count by geopolitical zone fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching geopolitical zone analytics:", error);
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
