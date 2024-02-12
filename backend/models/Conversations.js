const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    }, //Stores the userId who is logged in ...and the another user with whom i have done the text
    blockingUserId:{
      type:Number,
    },
    blockedUser: [
      {
        type: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
