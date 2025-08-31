import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, group, content } = req.body;

    // Validation
    if (!sender || !content) {
      return res.status(400).json({ msg: "Sender and content are required" });
    }

    if (!receiver && !group) {
      return res.status(400).json({ msg: "Provide either receiver or group" });
    }

    // Create message
    const message = new Message({
      sender,
      content,
      receiver: receiver || null,
      group: group || null,
    });

    await message.save();

    // Populate sender and receiver/group
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("group", "name");

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  try {
    const { groupId, userId, senderId } = req.query;

    let filter = {};

    if (groupId) {
      filter.group = groupId; // messages in a group
    } else if (userId && senderId) {
      // one-to-one chat between sender and receiver
      filter.$or = [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ];
    }

    const messages = await Message.find(filter)
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("group", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
