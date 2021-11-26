const cookie = require('cookie');
const jwt = require("jsonwebtoken");
const Notification = require("../schemas/NotificationSchema");
const JWT_SECRET = process.env.JWT_SECRET;

exports.notification = async (req, res) => {
    const isCookie = cookie.parse(req.headers.cookie);
    const jsonToken = isCookie && isCookie.lifebook_auth_token;
    if (jsonToken) {
      let decode;
      await jwt.verify(jsonToken, JWT_SECRET, (err, data) => {
        if (err) {
          return res.status(403).json({
            message: "invalid web token",
          });
        }
        decode = data;
      });
      if (decode) {
        const getNotification = await Notification.findOne({ user_id: decode.id });
        if (getNotification) {
          res.status(200).json({
            read: getNotification.read.reverse(),
            unread: getNotification.unread.reverse()
          });
        }
      }
    } else {
      res.status(403).json({
        message: "No web token found!",
      });
    }

}
