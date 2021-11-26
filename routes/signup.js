const bcrypt = require('bcrypt');
const User = require("../schemas/UserSchema");
const Notification = require("../schemas/NotificationSchema")


exports.signup = async (req, res) => {
      const {
        firstName,
        lastName,
        email,
        username,
        password,
        Dob,
        gender
      } = req.body;

      if (
        firstName &&
        lastName &&
        email &&
        username &&
        password &&
        Dob &&
        gender
      ) {
        let errors = [];
        if (await User.findOne({ email })) {
          errors.push("Email already taken!");
        }
        if (await User.findOne({ username })) {
          errors.push("Username not available!");
        }
        if (errors.length > 0) {
          return res.status(403).json({ errors });
        }
        try {
          const hashPass = await bcrypt.hash(password, 12);
          const newUser = await new User({
            name: {
              firstName,
              lastName,
            },
            email,
            username,
            password: hashPass,
            gender,
            Dob
          });
          await newUser.save();

          const newNotification = await new Notification({
            user_id: newUser._id,
            read: [],
            unread: []
          })
          await newNotification.save()

  
          res.status(200).json({ message: "Account created successfully", newUser });
        } catch (error) {
          res.status(400).json({error, errors: ["Could not create account"]})
        }
      } else {
        return res.status(404).json({ errors: ["Missing informations!"] });
      }
    

}
