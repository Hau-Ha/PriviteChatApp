import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// @ts-ignore
export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id; // from auth middleware

    if (!to) {
      return res.status(400).json({ message: "Recipient user ID is required" });
    }

    if (to === from.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "Recipient user not found" });
    }
    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.exists({ userA, userB }),
      FriendRequest.exists({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends" });
    }

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const request = await FriendRequest.create({
      from,
      to,
      message,
    });

    return res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id; // from auth middleware
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean();

    return res.status(200).json({
      message: "Friend request accepted",
      friend: {
        _id: from?._id,
        display: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore
export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id; // from auth middleware
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to decline this friend request",
      });
    }

    await FriendRequest.findByIdAndDelete(requestId);
    return res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore
export const getAllFriends = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ts-ignore

export const getFriendRequests = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
