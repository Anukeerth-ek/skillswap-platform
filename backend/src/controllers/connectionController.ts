// src/controllers/connectionController.ts

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { getIO, getOnlineUsers } from "../socket";
const io = getIO();
const onlineUsers = getOnlineUsers();
export const sendConnectionRequest = async (req: Request, res: Response) => {
     const { senderId, receiverId } = req.body;

     if (senderId === receiverId) {
          res.status(400).json({ message: "Cannot connect with yourself" });
          return;
     }

     try {
          const existing = await prisma.connection.findFirst({
               where: {
                    senderId,
                    receiverId,
               },
          });

          if (existing) {
           
                res.status(400).json({ message: "Connection request already exists" });
                    return
          }

          const connection = await prisma.connection.create({
               data: {
                    senderId,
                    receiverId,
                    status: "PENDING",
               },
          });

          const receiverSocketId = onlineUsers.get(receiverId);
          if (receiverSocketId) {
               io.to(receiverSocketId).emit("connection:request", connection);
          }

          res.status(201).json(connection);
     } catch (error) {
          console.error("Send connection error:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

export const acceptConnectionRequest = async (req: Request, res: Response) => {
     const { connectionId } = req.body;

     try {
          const updated = await prisma.connection.update({
               where: { id: connectionId },
               data: { status: "ACCEPTED" },
          });

          const senderSocketId = onlineUsers.get(updated.senderId);
          if (senderSocketId) {
               io.to(senderSocketId).emit("connection:accepted", updated);
          }

          res.status(200).json(updated);
     } catch (error) {
          console.error("Accept connection error:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

export const declineConnectionRequest = async (req: Request, res: Response) => {
     const { connectionId } = req.body;

     try {
          const declined = await prisma.connection.update({
               where: { id: connectionId },
               data: { status: "DECLINED" },
          });

          res.status(200).json(declined);
     } catch (error) {
          console.error("Decline connection error:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};


export const getIncomingRequests = async (req: Request, res: Response) => {
  const userId = req.params.userId; // or get from token

  try {
    const requests = await prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get incoming requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAcceptedConnections = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const connections = await prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(200).json(connections);
  } catch (error) {
    console.error("Get accepted connections error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all accepted connections for a user (only the other user's details)
export const getUserConnections = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const connections = await prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            skillsOffered: true,
            skillsWanted: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Map to return only the "other user" in each connection
    const formatted = connections.map((conn) => {
      const isSender = conn.senderId === userId;
      const otherUser = isSender ? conn.receiver : conn.sender;

      return {
        id: conn.id,
        user: otherUser,
        connectedAt: conn.createdAt, // optional: when accepted
      };
    });

    res.status(200).json({ connections: formatted });
  } catch (error) {
    console.error("Get user connections error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
