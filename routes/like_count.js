import dbConnect from "../../../../server/db/dbConnect";
import Posts from "../../../../server/schemas/postSchema";

export default async function handleLogin(req, res) {
  await dbConnect();
  if (req.method === "GET") {
      const authHeader = req.headers['authorization'];
      const postId = authHeader && authHeader.split(' ')[1];
      if(postId){
          try {
            const findPost = await Posts.findOne({ _id: postId }, ["reactions.likes"]);
            res.status(200).json({likes: findPost.reactions.likes})
          } catch (error) {
            console.log(error);
            res.status(400).json({
              error,
              message: "internal server error"
            });
          }
      }
  } else {
    return res.status(405).json({ message: "Invalid Request Method" });
  }
}
