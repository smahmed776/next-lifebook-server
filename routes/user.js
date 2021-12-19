const User = require("../schemas/UserSchema");
const Author = require("../schemas/AuthorSchema");
const Notification = require("../schemas/NotificationSchema");


exports.getUser = async (req, res) => {
  const userId = req.userId.id;

  const findUser = await User.findById(userId, [
    "email",
    "username",
    "name.firstName",
    "name.lastName",
    "_id",
    "profile.profileImage",
    "profile.coverImage",
    "friends",
    "friend_requests",
    "verified",
    "clearance",
  ]);

  if (findUser) {
    res.status(200).json(findUser);
  } else {
    const isAuthor = await Author.findById(decode.id);
    res.status(200).json(isAuthor);
  }
};
