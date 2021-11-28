const Posts = require("../schemas/postSchema");
const Notification = require("../schemas/NotificationSchema");

exports.likepost = async (req, res) => {
    const { user_id, post_id } = req.body;
    if (user_id && post_id) {
      try {
        const checkReaction = await Posts.findOne({ _id: post_id });
        if (checkReaction.reactions.likes.includes(user_id)) {
          res.status(200).json({ message: "already liked" });
        } else {
          await Posts.findOneAndUpdate(
            { _id: post_id },
            {
              $push: {
                "reactions.likes": user_id,
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
          if (getPost.author_id === user_id) {
            res.status(200).json({ message: "liked" });
            return res.end();
          }
          const getNotification = await Notification.findOne({
            user_id: getPost.author_id,
          });
          // if (!getNotification) {
          //   const newNotification = await new Notification({
          //     user_id: getPost.author_id,
          //     read: [],
          //     unread: [],
          //   });
          //   await newNotification.save();
          // }
          const userReadthisNotification = getNotification.read.find(
            (notify) => notify.post_id === post_id && notify.type === 'like'
          );
          const userUnReadthisNotification = getNotification.unread.find(
            (notify) => notify.post_id === post_id && notify.type === 'like'
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
                      type: "like"
                    },
                  },
                },

                {
                  $push: {
                    "read.$[a].buddy_id": user_id,
                  },
                },
                {
                  new: true,
                  arrayFilters: [
                    {
                      "a.post_id": post_id,
                      "a.type": "like"
                    },
                  ],
                }
              );
              const notifObj =
                pushId.read[
                  pushId.read.findIndex((i) => i.post_id === post_id && i.type === "like")
                ];
              await Notification.findOneAndUpdate(
                {
                  user_id: getPost.author_id,
                },
                {
                  $pull: {
                    read: {
                      post_id: post_id,
                      type: "like"
                    },
                  },
                  $push: {
                    unread: notifObj,
                  },
                },
                {new: true}
              );
            } else {
              //user got notification but didn't read this notification yet
              await Notification.findOneAndUpdate(
                {
                  user_id: getPost.author_id,
                  unread: {
                    $elemMatch: {
                      post_id: post_id,
                      type: "like"
                    },
                  },
                },

                {
                  $push: {
                    "unread.$[a].buddy_id": user_id,
                  },
                },
                {
                  new: true,
                  arrayFilters: [
                    {
                      "a.post_id": post_id,
                      "a.type" : "like"
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
                    type: "like",
                    buddy_id: [user_id],
                    created: Date.now(),
                    post_id: post_id,
                  },
                },
              },
              {new: true}
            );
          }

          res.status(200).json({
            message: "liked",
          });
          res.end();
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error,
          message: "internal server error",
        });
      }
    } else {
      return res.status(404).json({ message: "Missing Informations!" });
    }
 
}
