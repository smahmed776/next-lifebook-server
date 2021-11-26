const Posts = require("../schemas/postSchema");

exports.singlepost = async (req, res ) => {
    const { id } = req.params;
    if(id){
        const getPost = await Posts.findOne({_id: id});
        if(getPost){
            res.status(200).json({getPost});
            res.end()
        } else {
            res.status(404).json({notFound: true, message: "Post not found!"})
            res.end()
        }
    }
}