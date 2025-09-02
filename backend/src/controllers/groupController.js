import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
   try {
    const { name, description, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ error: "Name and owner are required" });
    }

    const group = new Group({
      name,
      description,
      owner,
      members: [owner],
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.json(group);
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

