import mongoose from "mongoose";
import Settings from "./models/Settings.js";
import Social from "./models/Social.js";
import "./config/env.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        email: "admin@example.com",
        phone: "+911234567890",
        leetcodeUsername: "GNANESHSANGATI"
      });
    } else {
      settings.leetcodeUsername = "GNANESHSANGATI";
    }

    await settings.save();
    console.log("✅ Seed complete: Settings updated with leetcodeUsername='GNANESHSANGATI'");

    let leetcodeSocial = await Social.findOne({ platform: "LeetCode" });
    if (!leetcodeSocial) {
      leetcodeSocial = new Social({
        platform: "LeetCode",
        url: "https://leetcode.com/u/GNANESHSANGATI/"
      });
    } else {
      leetcodeSocial.url = "https://leetcode.com/u/GNANESHSANGATI/";
    }

    await leetcodeSocial.save();
    console.log("✅ Seed complete: Social link for LeetCode added/updated.");

    let gfgSocial = await Social.findOne({ platform: "GeeksforGeeks" });
    if (!gfgSocial) {
      gfgSocial = new Social({
        platform: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/user/gnaneshsangati/"
      });
    } else {
      gfgSocial.url = "https://www.geeksforgeeks.org/user/gnaneshsangati/";
    }

    await gfgSocial.save();
    console.log("✅ Seed complete: Social link for GeeksforGeeks added/updated.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
