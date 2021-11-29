const Notification = require("../schemas/NotificationSchema");

exports.readnotification = async (req, res) => {
  const { user_id } = req.body;
  if (user_id) {
    const getUnreadArray = await Notification.findOne({ user_id: user_id });
    let finalArray = getUnreadArray.read || [];
    for (let index = 0; index < getUnreadArray.unread.length; index++) {
      const element = getUnreadArray.unread[index];
      await finalArray.push(element);
    }
    await Notification.findOneAndUpdate(
      { user_id: user_id },
      {
        $set: { unread: [] },
       
      },
      { new: true, }
    );
    await Notification.findOneAndUpdate(
      { user_id: user_id },
      {
        $set: { read: finalArray },
       
      },
      { new: true, }
    );
    res.status(200);
    res.end();
  }
};
