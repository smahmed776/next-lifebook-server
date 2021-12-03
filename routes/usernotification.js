const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Notification = require("../schemas/NotificationSchema");
const JWT_SECRET = process.env.JWT_SECRET;

exports.usernotification = async(req, res) => {
    const lookForCookie = req.headers.cookie && cookie.parse(req.headers.cookie);
    const token = lookForCookie && lookForCookie.lifebook_auth_token
    if(token){
        await jwt.verify(token, JWT_SECRET, async (err, doc)=> {
            if(!err){
                const { id } = req.params;
                if (id === doc.id){
                    const getNotification = await Notification.findOne(
                        {user_id : doc.id},
                        ["read", "unread"]
                    )
                }
            }
        })
    }
}