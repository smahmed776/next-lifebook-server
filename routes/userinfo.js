const User = require("../schemas/UserSchema");

exports.userinfo = async (req, res) => {
  const { buddy_id, information } = req.body;
  if(buddy_id && buddy_id.length > 0 && information && information.length > 0){
    let userInfo = [];
    for (let index = 0; index < buddy_id.length; index++) {
      const element = buddy_id[index];
      const findUser = await User.findOne({_id: element}, information)
      userInfo.push(findUser)
    }
    res.status(200).json(userInfo)
  }

  // if (buddy_id && buddy_id.length > 0 && buddy_id.length < 2) {
  //   const userinfo_1 = await User.findOne({ _id: buddy_id[0] }, [
  //     "name",
  //     "username",
  //     "profile.profileImage",
  //   ]);
  //   res.status(200).json({
  //     users: [
  //       {
  //         name: userinfo_1.name,
  //         username: userinfo_1.username,
  //         profileImage: userinfo_1.profile.profileImage,
  //       },
  //     ],
  //   });
  // } else if (buddy_id && buddy_id.length >= 2) {
  //   const reverseArr = buddy_id.reverse();
  //   const userinfo_1 = await User.findOne({ _id: reverseArr[0] }, [
  //     "name",
  //     "username",
  //     "profile.profileImage",
  //   ]);
  //   const userinfo_2 = await User.findOne({ _id: reverseArr[1] }, [
  //     "name",
  //     "username",
  //     "profile.profileImage",
  //   ]);
  //   res.status(200).json({
  //     users: [
  //       {
  //         name: userinfo_1.name,
  //         username: userinfo_1.username,
  //         profileImage: userinfo_1.profile.profileImage,
  //       },
  //       {
  //         name: userinfo_2.name,
  //         username: userinfo_2.username,
  //         profileImage: userinfo_2.profile.profileImage,
  //       },
  //     ],
  //   });
  // }
};
