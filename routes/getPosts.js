const Posts = require("../schemas/postSchema");
const User = require("../schemas/UserSchema")
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
        const findFriends = await User.findOne({_id: doc.id}, ["friends"])
        if (findPosts.length > 0) {
          let getPosts = [];
          for (let index = 0; index < findPosts.length; index++) {
            const element = findPosts[index];
            if(findFriends.friends.includes(element.author_id)){
              getPosts.push(element)
            }
          }
          return res.status(200).json({
            Posts: getPosts.reverse(),
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
