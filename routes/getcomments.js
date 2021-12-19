const Posts = require("../schemas/postSchema");
const User = require("../schemas/UserSchema");

exports.getcomments = async (req, res) => {
    const { id } = req.params;
    if (id) {
      try {
        const findPost = await Posts.findOne({ _id: id }, ["reactions.comments"]);
        if(findPost){
            let userArr = [];
            for (let index = 0; index < findPost.reactions.comments.length; index++) {
              const element = findPost.reactions.comments[index];
              const findUser = await User.findOne({ _id: element.c_id });
              if(findUser){
                  userArr.push({
                    name: findUser.name,
                    image: findUser.profile.profileImage,
                    text: element.text,
                    created: element.created,
                    c_id: element.c_id,
                    verified: findUser.verified
                    
                  });
              }
            }
            res.status(200).json(userArr);
        } else {
            res.status(200).json([])
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error,
          message: "internal server error"
        });
      }
    }
 
}
