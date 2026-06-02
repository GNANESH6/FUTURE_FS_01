import Settings from "../models/Settings.js";

// GET public
export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

// ADMIN save/update
export const saveSettings = async (req, res) => {
  try {
    const { email, phone, leetcodeUsername, githubUsername } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({ email, phone, leetcodeUsername, githubUsername });
    } else {
      settings.email = email;
      settings.phone = phone;
      settings.leetcodeUsername = leetcodeUsername;
      settings.githubUsername = githubUsername;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
