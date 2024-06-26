const Users = require("../../schemas/UserSchema");

exports.updateUser = async (req, res) => {
  const userId = req.userId.id;
  const isAdmin = await Users.findOne({ _id: userId }, ["clearance"]);
  if (isAdmin.clearance === "admin") {
    const { id } = req.params;
    const { verified } = req.body;
    if (id) {
      await Users.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            verified: verified,
          },
        },
        { new: true, safe: true }
      );
      res.status(200).json({ message: "user information updated!" });
    }
  }
};
