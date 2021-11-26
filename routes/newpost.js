const User = require("../schemas/UserSchema");
const Posts = require("../schemas/postSchema");

exports.newpost = async (req, res) => {
    const {
      author_id,
      author_username,
      author_name,
      author_image,
      post,
      image,
      privacy
    } = req.body;

    if (
      author_id &&
      author_username &&
      author_name &&
      author_image &&
      privacy
    ) {
      if (post || image) {
        try {
          const newPost = await new Posts({
            author_id,
            author_username,
            author_name,
            author_image,
            privacy,
            created: Date.now(),
            post: {
              text: post,
              images: image
            },
          });
          await newPost.save();
          await User.findOneAndUpdate(
              {_id: author_id},
              {
                  $push: {
                      "profile.posts": {
                        post_id: newPost._id.toString(),
                        author_id,
                        author_username,
                        author_name,
                        author_image,
                        privacy,
                        post: {
                          text: post,
                          images: image
                        },

                      }
                  }
              }
          )

          res
            .status(200)
            .json({ message: "Post Created Successfully", newPost });
        } catch (error) {
          res.status(400).json({ error, errors: ["Could not create Post"] });
        }
    } else {
          res.status(403).json({ error, errors: ["Empty Post"] });
      }
    } else {
      return res.status(404).json({ errors: ["Missing informations!"] });
    }

}
