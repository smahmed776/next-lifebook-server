const User = require("../schemas/UserSchema");

exports.userimage = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const findUser = await User.findOne({ _id: id }, ["profile.profileImage", "verified"]);
    if (findUser) {
      res.status(200).json(findUser);
    }
  }
};
