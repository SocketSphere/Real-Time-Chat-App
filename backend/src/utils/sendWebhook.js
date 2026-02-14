import axios from "axios";

export const sendWelcomeEmail = async (name, email, token) => {
  try {
    await axios.post(process.env.MAKE_WEBHOOK_URL, {
      name,
      email,
      token
    });
  } catch (err) {
    console.error(err.message);
  }
};
