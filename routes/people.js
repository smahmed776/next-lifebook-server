const User = require("../schemas/UserSchema")

exports.people = async (req, res) =>{
    const { id } = req.params;
    if(id){
        const getPeople = await User.find({}, ["name", "profile.profileImage"]);
        const findUser = await User.findOne({_id: id});
        const pullUser = getPeople.filter(people => people._id.toString() !== id);
        let result = [];
        for (let index = 0; index < pullUser.length; index++) {
            const element = pullUser[index];
            if(findUser.friends.includes(element._id.toString())){
                return
            } else {
               await result.push(element)
            }   
        }
        res.status(200).json(result);
        res.end()
    }
}