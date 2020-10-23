const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myperson",
  },
  username: {
    type: String,
    required: true,
    max: 50,
  },
  website: {
    type: String,
  },
  country: {
    type: String,
  },
  programingLang: {
    type: [String],
    required: true,
  },
  portfolio: {
    type: String,
  },
  workrole: [
    {
      role: {
        type: String,
        required: true,
      },
      company: {
        type: String,
      },
      country: {
        type: String,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      details: {
        type: String,
      },
    },
  ],
  social: {
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("myprofile", ProfileSchema);
