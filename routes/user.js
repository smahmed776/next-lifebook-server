const jwt = require("jsonwebtoken");
const User = require("../schemas/UserSchema");
const Author = require("../schemas/AuthorSchema")
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
          "friends",
          "friend_requests",
          "verified",
          "clearance"
        ]);
       
        if(findUser){
        res.status(200).json(findUser);
        } else {
          const isAuthor = await Author.findById(decode.id)
          res.status(200).json(isAuthor)
        }
      }
    });
  } else {
    res.status(401).json({
      message: "No web token found!",
    });
  }
};
