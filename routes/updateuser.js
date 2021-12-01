const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../schemas/UserSchema")
const JWT_SECRET = process.env.JWT_SECRET;

exports.updateuser = async (req, res) => {
    const isCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
    const jsonToken = isCookie && isCookie.lifebook_auth_token;
    if (jsonToken) {
      let decode;
      await jwt.verify(jsonToken, JWT_SECRET, (err, data) => {
        if (err){
          return res.status(403).json({
            message: "invalid web token"
          });}
        decode = data;
      });
      const { image, type } = req.body;

      if (type === "profilepic") {
        await User.findOneAndUpdate(
          { _id: decode.id },
          {
            $set: {
              "profile.profileImage": image
            }, 
            $push : {
                "profile.allProfileImages": image
            }
          },
          { new: true }
        );
        res.status(200).json({
          message: "Profile Picture changed!"
        });
      }
      if (type === "coverpic") {
        await User.findOneAndUpdate(
          { _id: decode.id },
          {
            $set: {
              "profile.coverImage": image
            }
          },
          { new: true }
        );
        res.status(200).json({
          message: "Cover Picture changed!"
        });
      }
    } else {
      res.status(403).json({
        message: "No web token found!"
      });
    }
 
}
