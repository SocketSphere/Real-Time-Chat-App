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
    res.status(500).json({ error: "Server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ msg: "Already a member" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ msg: "Joined group successfully", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("owner", "username")
      .populate("members", "username");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteGroups =async(req,res)=>{
  try{
    const {groupId,userId}=req.body
    const group=await Group.findById(groupId)
    if(!group) return res.status(404).json({msg:"Group not found"})
    // await group.findByIdAndDelete(groupId);
    await group.deleteOne();
    res.status(200).json({msg:"Group deleted successfully"})  
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
}


export const leaveGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    // If the user is the owner, they cannot just leave (maybe delete instead)
    if (group.owner.toString() === userId) {
      return res.status(400).json({ msg: "Owner cannot leave their own group. Delete it instead." });
    }

    // Remove user from members
    group.members = group.members.filter((m) => m.toString() !== userId);
    await group.save();

    res.status(200).json({ msg: "Left group successfully", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
