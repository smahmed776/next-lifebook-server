const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Notification = require("../schemas/NotificationSchema");
const User = require("../schemas/UserSchema");
const JWT_SECRET = process.env.JWT_SECRET;

exports.confirmRequest = async (req, res) => {
  const checkForCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
  const webToken = checkForCookie && checkForCookie.lifebook_auth_token;
  if (webToken) {
    await jwt.verify(webToken, JWT_SECRET, async (err, doc) => {
      if (!err) {
        const { sender_id } = req.params;
        // remove notification

        await Notification.findOneAndUpdate(
          { user_id: doc.id },
          {
            $pull: {
              read: {
                type: "friendRequest",
                buddy_id: [sender_id],
              },
            },
          },
          { new: true }
        );

        // add sender_id to users friendlist and remove from received request list

        const addFrnd = await User.findOneAndUpdate(
          { _id: doc.id },
          {
            $push: {
              friends: sender_id,
            },
            $pull: {
              "friend_requests.received": sender_id,
            },
          },
          { new: true }
        );

        // sent notification off acceptance
        await Notification.findOneAndUpdate(
          { user_id: sender_id },
          {
            $push: {
              unread: {
                type: "confirmRequest",
                buddy_id: [doc.id],
                created: Date.now(),
              },
            },
          },
          { new: true }
        );

        await User.findOneAndUpdate(
          { _id: sender_id },
          {
            $push: {
              friends: doc.id,
            },
            $pull: {
              "friend_requests.sent": doc.id,
            },
          },
          { new: true }
        );

        res.status(200);
        res.end();
      }
    });
  }
};

exports.rejectRequest = async (req, res) => {
  const checkForCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
  const webToken = checkForCookie && checkForCookie.lifebook_auth_token;
  if (webToken) {
    await jwt.verify(webToken, JWT_SECRET, async (err, doc) => {
      if (!err) {
        const { sender_id } = req.params;
        // remove notification

        await Notification.findOneAndUpdate(
          { user_id: doc.id },
          {
            $pull: {
              read: {
                type: "friendRequest",
                buddy_id: [sender_id],
              },
            },
          },
          { new: true }
        );

        // remove from received request list

        await User.findOneAndUpdate(
          { _id: doc.id },
          {
            $pull: {
              "friend_requests.received": sender_id,
            },
          },
          { new: true }
        );

        // sent notification off rejectance
        await Notification.findOneAndUpdate(
          { user_id: sender_id },
          {
            $push: {
              unread: {
                type: "rejectRequest",
                buddy_id: [doc.id],
                created: Date.now(),
              },
            },
          },
          { new: true }
        );

        //remove doc.id from sender friend requestlist

        await User.findOneAndUpdate(
          { _id: sender_id },
          {
            $pull: {
              "friend_requests.sent": doc.id,
            },
          },
          { new: true }
        );
        res.status(200);
        res.end();
      }
    });
  }
};


exports.unfriend = async (req, res) => {
  const { receiver_id } = req.params;
  const { sender_id } = req.body;
  if(receiver_id && sender_id){
    await User.findOneAndUpdate(
      {
        _id: receiver_id
      },
      {
        $pull : {
          "friends": sender_id
        }
      },
      {
        new: true
      }
    );
    
    await User.findOneAndUpdate(
      {
        _id : sender_id
      },
      {
        $pull : {
          "friends": receiver_id
        },
      },
      {
        new: true
      }
    )
    res.status(200)
    res.end()
  }
}
