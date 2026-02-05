import About from "../models/About.js";

/**
 * Public – get about
 */
export const getAbout = async (req, res) => {
  const about = await About.findOne();
  res.json(about);
};

/**
 * Admin – save / update about
 */

export const saveAbout = async (req, res) => {
  const { content } = req.body;

  let about = await About.findOne();
  if (about) {
    about.content = content;
    await about.save();
  } else {
    about = await About.create({ content });
  }

  res.json(about);
};
