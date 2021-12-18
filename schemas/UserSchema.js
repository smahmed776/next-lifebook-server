const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required."],
  },
  password: {
    type: String,
    select: false,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: Object,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    required: true,
  },
  Dob: {
    type: String,
  },
  joined: {
    type: Date,
    default: Date.now(),
  },
  profile: {
    type: Object,
    default: {
      profileImage:
        "https://png.pngitem.com/pimgs/s/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png",
      coverImage:
        "https://www.chirripeppers.com/sitepad-data/uploads//2020/08/wild-triad2.jpg",

      coverVideo: {
        video: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        thumbnail:
          "https://diypbx.com/wp-content/uploads/2016/02/video-placeholder.jpg",
      },
      allProfileImages: ["https://i.stack.imgur.com/y9DpT.jpg"],
      allImagesAndVideos: {
        images: ["https://i.stack.imgur.com/y9DpT.jpg"],
        videos: [
          "https://diypbx.com/wp-content/uploads/2016/02/video-placeholder.jpg",
        ],
      },
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },

    coverVideo: {
      type: Object,
      video: { type: String },
      thumbnail: { type: String },
    },
    allProfileImages: {
      type: Array,
      default: [],
    },
    allImagesAndVideos: {
      type: Object,
      images: {
        type: Array,
        default: [],
      },
      videos: {
        type: Array,
        default: [],
      },
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  friends: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  newsfeed: {
    type: Array,
    default: [],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  friend_requests: {
    type: Object,

    sent: {
      type: Array,
      default: [],
    },
    received: {
      type: Array,
      default: [],
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  clearance: {
    type: String,
    enum: ["admin", "user", "moderator"],
    default: "user"
  }
});

mongoose.models = {};

const User = mongoose.model("User", UserSchema);

module.exports = User;
