const { Message, User } = require("../models");
const Joi = require("joi");

// Validation schemas
const sendMessageSchema = Joi.object({
  receiver: Joi.string().required(),
  message: Joi.string().required().min(1).max(1000),
  // file: Joi.object().optional()
});

// Send message
const sendMessage = async (req, res) => {
  try {
    const { error } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { receiver, message } = req.body;
    const sender = req.user._id;

    // Validate receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(400).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Don't allow sending message to self
    if (receiver === sender.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself",
      });
    }

    const newMessage = new Message({
      sender,
      receiver,
      message,
      // file: file || null,
    });

    await newMessage.save();
    await newMessage.populate("sender", "name email profileImage");
    await newMessage.populate("receiver", "name email profileImage");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        message: newMessage,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error sending message",
    });
  }
};

// Get conversation between current user and another user
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
      deleted: false,
    })
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
      deleted: false,
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching conversation",
    });
  }
};

// Get all conversations for current user
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get unique users the current user has messaged with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
          deleted: false,
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", currentUserId] },
              "$receiver",
              "$sender",
            ],
          },
          message: 1,
          createdAt: 1,
          seen: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", currentUserId] },
                    { $eq: ["$seen", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            profileImage: "$user.profileImage",
            role: "$user.role",
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        conversations,
      },
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching conversations",
    });
  }
};

// Mark message as seen
const markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiver: currentUserId },
      { seen: true },
      { new: true },
    )
      .populate("sender", "name email")
      .populate("receiver", "name email");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message marked as seen",
      data: {
        message,
      },
    });
  } catch (error) {
    console.error("Mark as seen error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking message as seen",
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      },
      { deleted: true },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting message",
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markAsSeen,
  deleteMessage,
};
