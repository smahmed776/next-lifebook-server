const Posts = require("../schemas/postSchema");
const User = require("../schemas/UserSchema");

exports.likes = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      const findPost = await Posts.findOne({ _id: id }, ["reactions.likes"]);
      if (findPost) {
        let userArr = [];
        for (let index = 0; index < findPost.reactions.likes.length; index++) {
          const element = findPost.reactions.likes[index];
          const findUser = await User.findOne({ _id: element });
          if (findUser) {
            userArr.push({
              name: findUser.name,
              image: findUser.profile.profileImage,
            });
          }
        }
        res.status(200).json(userArr);
      } else {
        res.status(200).json([]);
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
