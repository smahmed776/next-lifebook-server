const Posts = require("../schemas/postSchema");

exports.getProfilePost = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const findPosts = await Posts.find({ author_id: id });
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
    return res.status(403).json({ message: "No cookie found" });
  }
};
