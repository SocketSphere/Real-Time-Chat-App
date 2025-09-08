// backend/controllers/groupController.js
import Group from "../models/Group.js";
import User from "../models/User.js";
import { createNotification } from "./notificationsController.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, owner } = req.body;
    if (!name || !owner) {
      return res.status(400).json({ error: "Name and owner are required" });
    }
    
    // Check if owner exists
    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(404).json({ error: "Owner not found" });
    }
    
    const group = new Group({
      name,
      description,
      owner,
      members: [owner],
    });
    await group.save();
    
    // Populate the group with owner details
    const populatedGroup = await Group.findById(group._id)
      .populate("owner", "firstName lastName profileImage")
      .populate("members", "firstName lastName profileImage");
    
    // Create notification for group creation
    await createNotification({
      userId: owner,
      type: "system",
      title: "Group Created",
      message: `You created the group "${name}"`,
      relatedId: group._id,
      relatedModel: "Group",
      metadata: {
        groupName: name,
        membersCount: 1
      }
    });
    
    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId)
      .populate("owner", "firstName lastName profileImage")
      .populate("members", "firstName lastName profileImage");
    
    if (!group) return res.status(404).json({ msg: "Group not found" });
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (group.members.some(member => member._id.toString() === userId)) {
      return res.status(400).json({ msg: "Already a member" });
    }
    
    group.members.push(userId);
    await group.save();
    
    // Create notification for the user who joined
    await createNotification({
      recipient: userId,
      sender: userId,
      type: "group_invite",
      title: "Group Joined",
      message: `You joined the group "${group.name}"`,
      relatedId: group._id,
      relatedModel: "Group",
      metadata: {
        groupName: group.name,
        ownerName: `${group.owner.firstName} ${group.owner.lastName}`
      }
    });
    
    // Create notification for group owner
    await createNotification({
      recipient: group.owner._id,
      sender: userId,
      type: "group_message",
      title: "New Member",
      message: `${user.firstName} ${user.lastName} joined your group "${group.name}"`,
      relatedId: group._id,
      relatedModel: "Group",
      metadata: {
        groupName: group.name,
        newMemberName: `${user.firstName} ${user.lastName}`,
        newMemberId: userId
      }
    });
    
    res.status(200).json({ 
      msg: "Joined group successfully", 
      group: await Group.findById(groupId)
        .populate("owner", "firstName lastName profileImage")
        .populate("members", "firstName lastName profileImage")
    });
  } catch (err) {
    console.error("Error joining group:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteGroups = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    
    const group = await Group.findById(groupId)
      .populate("owner", "firstName lastName profileImage")
      .populate("members", "firstName lastName profileImage");
    
    if (!group) return res.status(404).json({ msg: "Group not found" });
    
    // Check if user is the owner
    if (group.owner._id.toString() !== userId) {
      return res.status(403).json({ msg: "Only the group owner can delete the group" });
    }
    
    const groupName = group.name;
    const memberIds = group.members.map(member => member._id.toString());
    
    // Delete the group
    await Group.findByIdAndDelete(groupId);
    
    // Create notifications for all members about group deletion
    for (const memberId of memberIds) {
      if (memberId !== userId) { // Don't notify the deleter twice
        await createNotification({
          recipient: memberId,
          type: "system",
          title: "Group Deleted",
          message: `The group "${groupName}" was deleted by the owner`,
          relatedId: null,
          relatedModel: null,
          metadata: {
            groupName: groupName,
            deletedBy: `${group.owner.firstName} ${group.owner.lastName}`
          }
        });
      }
    }
    
    // Notification for the owner
    await createNotification({
      recipient: userId,
      type: "system",
      title: "Group Deleted",
      message: `You deleted the group "${groupName}"`,
      relatedId: null,
      relatedModel: null,
      metadata: {
        groupName: groupName,
        membersCount: memberIds.length
      }
    });
    
    res.status(200).json({ msg: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: err.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    
    const group = await Group.findById(groupId)
      .populate("owner", "firstName lastName profileImage")
      .populate("members", "firstName lastName profileImage");
    
    if (!group) return res.status(404).json({ msg: "Group not found" });
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // If the user is the owner, they cannot just leave
    if (group.owner._id.toString() === userId) {
      return res.status(400).json({ 
        msg: "Owner cannot leave their own group. Delete it instead or transfer ownership first." 
      });
    }
    
    // Check if user is actually a member
    if (!group.members.some(member => member._id.toString() === userId)) {
      return res.status(400).json({ msg: "You are not a member of this group" });
    }
    
    // Remove user from members
    group.members = group.members.filter(member => member._id.toString() !== userId);
    await group.save();
    
    // Create notification for the user who left
    await createNotification({
      recipient: userId,
      sender: userId,
      type: "system",
      title: "Group Left",
      message: `You left the group "${group.name}"`,
      relatedId: group._id,
      relatedModel: "Group",
      metadata: {
        groupName: group.name,
        ownerName: `${group.owner.firstName} ${group.owner.lastName}`
      }
    });
    
    // Create notification for group owner
    await createNotification({
      recipient: group.owner._id,
      sender: userId,
      type: "group_message",
      title: "Member Left",
      message: `${user.firstName} ${user.lastName} left your group "${group.name}"`,
      relatedId: group._id,
      relatedModel: "Group",
      metadata: {
        groupName: group.name,
        leftMemberName: `${user.firstName} ${user.lastName}`,
        leftMemberId: userId
      }
    });
    
    res.status(200).json({ 
      msg: "Left group successfully", 
      group: await Group.findById(groupId)
        .populate("owner", "firstName lastName profileImage")
        .populate("members", "firstName lastName profileImage")
    });
  } catch (err) {
    console.error("Error leaving group:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("owner", "firstName lastName profileImage")
      .populate("members", "firstName lastName profileImage");
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (err) {
    console.error("Error fetching group:", err);
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







