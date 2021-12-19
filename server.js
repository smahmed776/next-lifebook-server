require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookie = require("cookie");
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET;
// import routes
const { getPosts } = require("./routes/getPosts");
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
const { readnotification } = require("./routes/readnotification");
const { getProfilePost } = require("./routes/getProfilePost");
const { people } = require("./routes/people");
const { sentrequest } = require("./routes/sentrequest");
const { confirmRequest, rejectRequest, unfriend } = require("./routes/friendrequest");
const { getFriends } = require("./routes/getFriends");
const { adminUsersInfo } = require("./routes/admin/adminUsersInfo");
const { updateUser } = require("./routes/admin/adminupdate");

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// middleware for authentication
const authenticate = (req, res, next) => {
  const checkForCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
  const token = checkForCookie && checkForCookie.lifebook_auth_token
  if(token){
    jwt.verify(token, JWT_SECRET, (err, doc)=> {
      if(err){
        const options = {
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
          sameSite: "none",
          path: "/",
          maxAge: 1,
        };
        res.setHeader(
          "set-cookie",
          cookie.serialize("lifebook_auth_token", "invalid token", options)
        );
        return res.status(403).json({
          message: "invalid web token",
        });
      }
      req.userId = doc;
      next()
    })
  }
}



// routes
app.get("/api/auth/v1/user", authenticate, getUser);
app.get("/api/auth/v1/userimage/:id", userimage);
app.get("/api/auth/v1/people/:id", people);
app.get("/api/auth/v1/posts", getPosts);
app.get("/api/auth/v1/posts/:id", getProfilePost);
app.post("/api/auth/v1/userinfo", userinfo);
app.put("/api/auth/v1/updateuser", updateuser);
app.put("/api/auth/v1/unlikepost", unlikepost);
app.post("/api/auth/v1/signup", signup);
app.get("/api/auth/v1/notification", notification);
// app.post("/api/auth/v1/notification/:id", notification);
app.put("/api/auth/v1/likepost", likepost);
app.post("/api/auth/v1/login", login);
app.delete("/api/auth/v1/logout", logout);
app.post("/api/auth/v1/newpost", newpost);
app.get("/api/auth/v1/comments/:id", getcomments);
app.get("/api/auth/v1/likes/:id", likes);
app.delete("/api/auth/v1/deletepost/:id", deletePost);
app.get("/api/auth/v1/singlepost/:id", singlepost);
app.put("/api/auth/v1/comment", comment);
app.put("/api/auth/v1/readnotification", readnotification);
app.put("/api/auth/v1/sentrequest/:receiver_id", sentrequest);
app.put("/api/auth/v1/confirmrequest/:sender_id", confirmRequest);
app.put("/api/auth/v1/rejectrequest/:sender_id", rejectRequest);
app.put("/api/auth/v1/unfriend/:receiver_id", unfriend);
app.post("/api/auth/v1/friends/:id", getFriends);
app.post("/api/auth/v1/admin/users", adminUsersInfo);
app.post("/api/auth/v1/adminupdate/:id", authenticate, updateUser)
