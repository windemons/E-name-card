const mongoose = require("mongoose");

const UserCardSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: true
  },

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: null
  },

  templateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CardTemplate",
    default: null
  },

  profileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Profile",
    default: null
  },

  qrcode: {
    qrcodeImg: { type: String, default: null },  // ảnh QR nếu có
    qrFrame: { type: String, default: "circle" }, 
    qrDecoration: { type: String, default: null },
    qrLogo: { type: String, default: null }
  }

}, { timestamps: true });

module.exports = mongoose.model("UserCard", UserCardSchema);
