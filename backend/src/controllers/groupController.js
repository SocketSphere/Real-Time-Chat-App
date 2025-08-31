import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, owner, members } = req.body;
    const group = new Group({ name, description, owner, members });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("owner", "username").populate("members", "username");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single group
export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("owner", "username email")
      .populate("members", "username email");
    if (!group) return res.status(404).json({ msg: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};