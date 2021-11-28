require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
// import routes
const { getPosts } = require("./routes/posts");
const { getUser } = require("./routes/user");
const { userimage } = require("./routes/userimage");
const { userinfo } = require("./routes/userinfo");
const { updateuser } = require("./routes/updateuser");
const { unlikepost } = require("./routes/unlikepost");
const { signup } = require("./routes/signup");
const { notification } = require("./routes/notification");
const { likepost } = require("./routes/likepost");
const { login } = require("./routes/login");
const { logout } = require("./routes/logout");
const { newpost } = require("./routes/newpost");
const { getcomments } = require("./routes/getcomments");
const { likes } = require("./routes/likes");
const { deletePost } = require("./routes/deletepost");
const { singlepost } = require("./routes/singlepost");
const { comment } = require("./routes/comment");

// Database connection
const DB = process.env.MONGO_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to mongo database");
}
// cors
app.use(
  cors({
    origin: process.env.R_URL,
    credentials: true,
  })
);

// Start server
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
app.use(express.json());

// routes
app.get("/api/auth/v1/user", getUser);
app.get("/api/auth/v1/userimage/:id", userimage);
app.get("/api/auth/v1/posts/:id", getPosts);
app.get("/api/auth/v1/userinfo", userinfo);
app.put("/api/auth/v1/updateuser", updateuser);
app.put("/api/auth/v1/unlikepost", unlikepost);
app.post("/api/auth/v1/signup", signup);
app.get("/api/auth/v1/notification", notification);
app.put("/api/auth/v1/likepost", likepost);
app.post("/api/auth/v1/login", login);
app.delete("/api/auth/v1/logout", logout);
app.post("/api/auth/v1/newpost", newpost);
app.get("/api/auth/v1/comments/:id", getcomments);
app.get("/api/auth/v1/likes/:id", likes);
app.delete("/api/auth/v1/deletepost/:id", deletePost);
app.get("/api/auth/v1/singlepost/:id", singlepost);
app.put("/api/auth/v1/comment", comment);
