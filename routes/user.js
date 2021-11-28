const jwt = require("jsonwebtoken");
const User = require("../schemas/UserSchema");
const Notification = require("../schemas/NotificationSchema");
const cookie = require("cookie");
const JWT_SECRET = process.env.JWT_SECRET;

exports.getUser = async (req, res) => {
  const isCookie = req.headers.cookie && cookie.parse(req.headers.cookie);

  const jsonToken = isCookie && isCookie.lifebook_auth_token;

  if (jsonToken) {
    await jwt.verify(jsonToken, JWT_SECRET, async (err, decode) => {
      if (err) {
        const options = {
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
          sameSite: "none",
          path: "/",
          maxAge: 1,
        };
        res.setHeader(
          "set-cookie",
          cookie.serialize("lifebook_auth_token", "invalid token", options)
        );
        res.status(404).json({
          message: "invalid web token",
        });
      } else {
        const findUser = await User.findById(decode.id, [
          "email",
          "username",
          "name.firstName",
          "name.lastName",
          "_id",
          "profile.profileImage",
          "profile.coverImage",
        ]);
        const user_notification = await Notification.findOne({
          user_id: decode.id,
        });
        res.status(200).json({
          findUser: {
            email: findUser.email,
            username: findUser.username,
            name: {
              firstName: findUser.name.firstName,
              lastName: findUser.name.lastName,
            },
            _id: findUser._id,
            profile: {
              profileImage: findUser.profile.profileImage,
              coverImage: findUser.profile.coverImage,
            },
            notification: {
              read: user_notification.read,
              unread: user_notification.unread,
            },
          },

          message: "User Found",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "No web token found!",
    });
  }
};
