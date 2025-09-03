import Contact from "../models/Contact.js";

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.params.userId })
      .populate("friendId", "firstName lastName loginId email");

    const formatted = contacts.map(c => ({
      _id: c._id,
      friendId: c.friendId._id,
      friendName: `${c.friendId.firstName} ${c.friendId.lastName}`,
      friendEmail: c.friendId.email,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const addContact = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const exists = await Contact.findOne({ userId, friendId });
    if (exists) {
      return res.status(400).json({ msg: "Already in contacts" });
    }

    const contact = new Contact({ userId, friendId, status: "accepted" });
    await contact.save();

    // Populate friend for response
    await contact.populate("friendId", "firstName lastName email");

    res.json({
      msg: "Contact added successfully",
      contact: {
        _id: contact._id,
        friendId: contact.friendId._id,
        name: `${contact.friendId.firstName} ${contact.friendId.lastName}`,
        email: contact.friendId.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
