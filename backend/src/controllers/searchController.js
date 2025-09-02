// searchController.js
import User from "../models/User.js";
import Group from "../models/Group.js";

export const searchAll = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { loginId: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    // add `name` for frontend display
    const usersWithName = users.map(u => ({
      ...u.toObject(),
      name: `${u.firstName} ${u.lastName}`,
    }));

    const groups = await Group.find({ name: { $regex: query, $options: "i" } }).populate(
      "owner",
      "firstName lastName"
    );

    res.json({ users: usersWithName, groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

