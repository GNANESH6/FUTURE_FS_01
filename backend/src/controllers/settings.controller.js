import Settings from "../models/Settings.js";

// GET public
export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

// ADMIN save/update
export const saveSettings = async (req, res) => {
  const { email, phone } = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({ email, phone });
  } else {
    settings.email = email;
    settings.phone = phone;
  }

  await settings.save();
  res.json(settings);
};
