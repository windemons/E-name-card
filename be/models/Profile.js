const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    brandPhoto: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    fblink: {
      type: String,
      default: "",
    },

    linkedinlink: {
      type: String,
      default: "",
    },

    githublink: {
      type: String,
      default: "",
    },

    xlink: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // tự sinh createdAt + updatedAt
);

module.exports = mongoose.model("Profile", ProfileSchema);
