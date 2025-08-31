import Plan from "../models/Plan.js";

export const createPlan = async (req, res) => {
  try {
    const { name, priceMonthly, priceYearly, features } = req.body;
    const plan = new Plan({ name, priceMonthly, priceYearly, features });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
