const User = require("../schemas/UserSchema");

exports.userinfo = async (req, res) => {
  const { buddy_id } = req.body;

  if (buddy_id && buddy_id.length > 0 && buddy_id.length < 2) {
    const userinfo_1 = await User.findOne({ _id: buddy_id[0] }, [
      "name",
      "username",
      "profile.profileImage",
    ]);
    res.status(200).json({
      users: [
        {
          name: userinfo_1.name,
          username: userinfo_1.username,
          profileImage: userinfo_1.profile.profileImage,
        },
      ],
    });
  } else if (buddy_id && buddy_id.length >= 2) {
    const reverseArr = buddy_id.reverse();
    const userinfo_1 = await User.findOne({ _id: reverseArr[0] }, [
      "name",
      "username",
      "profile.profileImage",
    ]);
    const userinfo_2 = await User.findOne({ _id: reverseArr[1] }, [
      "name",
      "username",
      "profile.profileImage",
    ]);
    res.status(200).json({
      users: [
        {
          name: userinfo_1.name,
          username: userinfo_1.username,
          profileImage: userinfo_1.profile.profileImage,
        },
        {
          name: userinfo_2.name,
          username: userinfo_2.username,
          profileImage: userinfo_2.profile.profileImage,
        },
      ],
    });
  }
};
