import Subscription from "../models/Subscription.js";

export const createSubscription = async (req, res) => {
  try {
    const { user, plan } = req.body;
    const subscription = new Subscription({ user, plan, startDate: new Date() });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.params.userId }).populate("plan");
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
