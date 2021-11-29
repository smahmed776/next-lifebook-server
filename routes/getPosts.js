const Posts = require("../schemas/postSchema");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.getPosts = async (req, res) => {
  const lookForCookie =
    req.headers.cookie && cookie.parse(req.headers.cookie).lifebook_auth_token;
  if (lookForCookie) {
    await jwt.verify(lookForCookie, JWT_SECRET, async (err, doc) => {
      if (!err) {
        const findPosts = await Posts.find();
        if (findPosts.length > 0) {
          const Posts = findPosts.reverse();
          return res.status(200).json({
            Posts,
            message: "Posts Found",
          });
        } else {
          return res.status(404).json({ message: "posts not found!" });
        }
      } else {
        console.log(err);
        return res.status(403).json({ message: "Invalid web token" });
      }
    });
  } else {
    return res.status(403).json({ message: "No cookie found" });
  }
};
