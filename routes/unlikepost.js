const Posts = require("../schemas/postSchema");

exports.unlikepost = async (req, res) => {
    const { user_id, user_username, post_id } = req.body;
    if (user_id && user_username && post_id) {
      try {
        const checkReaction = await Posts.findOne({ _id: post_id });
        if (checkReaction.reactions.likes.includes(user_id)) {
          await Posts.findOneAndUpdate(
            { _id: post_id },
            {
              $pull: {
                "reactions.likes": user_id,
              },
            },
            {
              safe: true,
            }
          );
          res.status(200).json({ message: "unliked" });
          res.end();
        } else {
          res.status(200).json({ message: "already unliked" });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error,
          message: "internal server error",
        });
      }
    } else {
      return res.status(404).json({ message: "Missing Informations!" });
    }
  
}
