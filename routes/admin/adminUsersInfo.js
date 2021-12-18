const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Users = require("../../schemas/UserSchema");
const Posts = require("../../schemas/postSchema");
const JWT_SECRET = process.env.JWT_SECRET;

exports.adminUsersInfo = async (req, res) => {
  const checkForCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
  const id = checkForCookie && checkForCookie.lifebook_auth_token;
  if (id) {
    jwt.verify(id, JWT_SECRET, async (err, doc) => {
      if (!err) {
        const users = await Users.find();
        const posts = await Posts.find();
        res.status(200).json({ users, posts });
      }
    });
  }
};
