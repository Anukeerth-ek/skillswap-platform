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
