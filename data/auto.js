
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  discordTag: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
});

const UserAuto = mongoose.model("users_auto", UserSchema);

module.exports = UserAuto
