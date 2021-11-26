const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    author_id: {
        type: String,
        required: [true, "author id is required."]
    },
    author_username: {
        type: String,
        required: true
    },
    author_image: {
        type: String
    },
    author_name: {
        type: Object,
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        required: true
    },
    post: {
        type: Object,
        text: {
            type: String
        },
        images: {
            type: Array
        }
    },
    created: {
        type: Date,
    },
    reactions: {
        type: Object,
        default: {
            likes: [],
            comments: [],
            shares: []
        },
        likes: {
            type: Array
        },
        comments: {
            type: Array
        },
        shares: {
            type: Array
        }
    },
    privacy: {
        type: String
    }
});

mongoose.models = {};

const Posts = mongoose.model("Posts", PostSchema);

module.exports = Posts;
