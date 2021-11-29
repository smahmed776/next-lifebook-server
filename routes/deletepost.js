const Notification = require("../schemas/NotificationSchema");
const Posts = require("../schemas/postSchema");
const User = require("../schemas/UserSchema");

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      const deletePost = await Posts.findOneAndDelete({ _id: id });
      console.log(deletePost)
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
        await Notification.findOneAndUpdate(
          {user_id: deletePost.author_id},
          {
            $pull: {
              "read": {post_id: deletePost._id.toString()}
            }
          },
          {new: true}
        )
        await Notification.findOneAndUpdate(
          {user_id: deletePost.author_id},
          {
            $pull: {
              "unread": {post_id: deletePost._id.toString()}
            }
          },
          {new: true}
        )
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
