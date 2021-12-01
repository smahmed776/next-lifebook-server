const User = require("../schemas/UserSchema");

exports.userinfo = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const buddy_id = authHeader && authHeader.split(" ")[1];
    const buddy_id_2 = authHeader && authHeader.split(" ")[2];
    if (buddy_id !== "undefined" && buddy_id_2 !== "undefined") {
      const userinfo_1 = await User.findOne({ _id: buddy_id }, [
        "name",
        "username",
        "profile.profileImage"
      ]);
      const userinfo_2 = await User.findOne({ _id: buddy_id_2 }, [
        "name",
        "username",
      ]);
      res.status(200).json({
        users: [
          {
            name: userinfo_1.name,
            username: userinfo_1.username,
            profileImage: userinfo_1.profile.profileImage
          },
          {
            name: userinfo_2.name,
            username: userinfo_2.username,
          },
        ],
      });
    } else {
      const userinfo_1 = await User.findOne({ _id: buddy_id }, [
        "name",
        "username",
        "profile.profileImage"
      ]);
      res.status(200).json({
        users: [
          {
            name: userinfo_1.name,
            username: userinfo_1.username,
            profileImage: userinfo_1.profile.profileImage
          },
        ],
      });
    }
 
}
