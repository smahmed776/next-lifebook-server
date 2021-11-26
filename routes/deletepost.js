const Posts = require("../schemas/postSchema");
const User = require("../schemas/UserSchema");

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      const deletePost = await Posts.findOneAndDelete({ _id: id });
      if (deletePost) {
        await User.updateOne(
          { _id: deletePost.author_id },
          {
            $pull: {
              "profile.posts": { post_id: deletePost._id.toString() },
            },
          },
          {
            new: true,
            safe: true,
          }
        );
        res.status(200);
        res.end();
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error,
        message: "internal server error",
      });
    }
  }
};
