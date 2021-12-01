const Notification = require("../schemas/NotificationSchema");
const Posts = require("../schemas/postSchema");

exports.comment = async (req, res) => {
  const { c_id, post_id, text, image } = req.body;
  if (c_id && post_id && text) {
    try {
      await Posts.findOneAndUpdate(
        { _id: post_id },
        {
          $push: {
            "reactions.comments": {
              c_id,
              text,
              created: Date.now(),
              image: (image && image) || null,
              reactions: {
                likes: [],
                replies: [],
              },
            },
          },
        },
        {
          new: true,
        }
      );

      const getPost = await Posts.findOne({ _id: post_id }, [
        "author_id",
        "author_name",
      ]);

      if (getPost.author_id === c_id) {
        return res.status(200).json({ message: "commented" });
      }
      const getNotification = await Notification.findOne({
        user_id: getPost.author_id,
      });
      const userReadthisNotification = getNotification.read.find(
        (notify) => notify.post_id === post_id && notify.type === "comment"
      );
      const userUnReadthisNotification = getNotification.unread.find(
        (notify) => notify.post_id === post_id && notify.type === "comment"
      );

      // check if user got notification for this post already
      if (userReadthisNotification || userUnReadthisNotification) {
        // user already received notification for this post

        // now check if user read this notification
        if (userReadthisNotification) {
          // User already read this notifications

          const pushId = await Notification.findOneAndUpdate(
            {
              user_id: getPost.author_id,
              read: {
                $elemMatch: {
                  post_id: post_id,
                  type: "comment",
                },
              },
            },

            {
              $push: {
                "read.$[a].buddy_id": c_id,
              },
              $set: {
                "read.$[a].created": Date.now(),
              }
            },
            {
              new: true,
              arrayFilters: [
                {
                  "a.post_id": post_id,
                  "a.type": "comment",
                },
              ],
            }
          );

          const notifObj =
            pushId.read[
              pushId.read.findIndex(
                (i) => i.post_id === post_id && i.type === "comment"
              )
            ];
          await Notification.findOneAndUpdate(
            {
              user_id: getPost.author_id,
            },
            {
              $pull: {
                read: {
                  post_id: post_id,
                  type: "comment",
                },
              },
              $push: {
                unread: notifObj,
              },
            },
            { new: true }
          );
        } else {
          //user got notification but didn't read this notification yet

          await Notification.findOneAndUpdate(
            {
              user_id: getPost.author_id,
              unread: {
                $elemMatch: {
                  post_id: post_id,
                  type: "comment",
                },
              },
            },

            {
              $push: {
                "unread.$[a].buddy_id": c_id,
              },
              $set: {
                "unread.$[a].created": Date.now(),
              },
            },
            {
              new: true,
              arrayFilters: [
                {
                  "a.post_id": post_id,
                  "a.type": "comment",
                },
              ],
            }
          );
        }
      } else {
        //if user didnot receive notification for this post

        await Notification.findOneAndUpdate(
          {
            user_id: getPost.author_id,
          },
          {
            $push: {
              unread: {
                type: "comment",
                buddy_id: [c_id],
                created: Date.now(),
                post_id: post_id,
              },
            },
          },
          { new: true }
        );
      }

      res.status(200).json({
        message: "commented",
      });
      res.end();
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error,
        message: "internal server error",
      });
    }
  } else {
    return res.status(404).json({ message: "Missing Informations!" });
  }
};
