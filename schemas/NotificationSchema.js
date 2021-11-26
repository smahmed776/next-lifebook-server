const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    read: {
        type: Array
    },
    unread: {
        type: Array
    }
});

mongoose.models = {};

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
