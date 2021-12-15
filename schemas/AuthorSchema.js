const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
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

  joined: {
    type: String,
  },
  type: {
      type: String
  }
});

mongoose.models = {};

const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
