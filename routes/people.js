const User = require("../schemas/UserSchema")

exports.people = async (req, res) =>{
    const { id } = req.params;
    if(id){
        const getPeople = await User.find({}, ["name", "profile.profileImage"]);
        res.status(200).json(getPeople)
    }
}