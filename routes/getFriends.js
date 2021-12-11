const User = require("../schemas/UserSchema");

exports.getFriends = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const findUser = await User.findOne({ _id: id });
    if (findUser) {
      let friends = [];

      for (let index = 0; index < findUser.friends.length; index++) {
        const element = findUser.friends[index];
        const user = await User.findOne({ _id: element });
        friends.push({
            name: {firstName: user.name.firstName, lastName: user.name.lastName},
            image: user.profile.profileImage,
            _id: user._id,
        });
      }
      res.status(200).json(friends);
    }
  }
};
