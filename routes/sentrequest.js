const Notification = require("../schemas/NotificationSchema");
const User = require("../schemas/UserSchema");

exports.sentrequest = async (req, res) => {
    const { receiver_id } = req.params;
    const { sender_id } = req.body;
    if(receiver_id && sender_id){
        await Notification.findOneAndUpdate({
            user_id : receiver_id
        },
        {
            $push : {
                "unread": {
                    buddy_id: [sender_id],
                    created: Date.now(),
                    type: "friendRequest",
                }
            }
        },
        {
            new: true
        }
        );
        await User.findOneAndUpdate(
            {_id: sender_id},
            {
                $push: {
                    "friend_requests": receiver_id
                }
            },
            {
                new: true
            }
        )
        res.status(200);
        res.end()
    }
}