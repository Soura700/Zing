const mongoose = require('mongoose');

const GoogleUsersSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = new mongoose.model('googleusers', GoogleUsersSchema);

//module.exports = userdb;
