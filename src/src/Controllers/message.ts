import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";
import { io, getRecipientSocketId } from "../socket/socket";

export default class MessageController {

  static async getConversations(req: Request, res: Response) {
    let status = http_status_code.serverError;
  
    try {
      let user = (req as any).user;
      let conn = await connect();
  
      let qr = `
        SELECT 
          Conversation.*, 
          User.*, 
          Message.content AS last_message,
          Message.created_at AS last_message_timestamp
        FROM 
          Conversation 
        JOIN 
          User ON (Conversation.user1_id = User.user_id OR Conversation.user2_id = User.user_id) 
        LEFT JOIN
          (
            SELECT 
              conversation_id, 
              MAX(created_at) AS max_created_at 
            FROM 
              Message 
            GROUP BY 
              conversation_id
          ) AS LatestMessage ON Conversation.conversation_id = LatestMessage.conversation_id
        LEFT JOIN 
          Message ON LatestMessage.conversation_id = Message.conversation_id AND LatestMessage.max_created_at = Message.created_at
        WHERE 
          (Conversation.user1_id = ? OR Conversation.user2_id = ?) 
          AND User.user_id != ?
          AND (Conversation.user1_id = ? OR Conversation.user2_id = ?)
      `;
  
      let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id, user.user_id, user.user_id, user.user_id, user.user_id]);
  
      conn.release(); // Release the connection back to the pool
  
      return res.status(http_status_code.ok).json({
        success: true,
        data: rows
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }
  
  
  

  static async sendMessage(req: Request, res: Response) {
    let status = http_status_code.serverError;
    let user = (req as any).user;
    let { recipient_id, content } = req.body;
  
    try {
      let conn = await connect();
  
      // Check for existing conversation
      let qr = "SELECT * FROM Conversation WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)";
      let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id, recipient_id, recipient_id, user.user_id]);
  
      if (rows.length === 0) {
        // If no existing conversation, create a new one
        let [create] = await conn.query<ResultSetHeader>("INSERT INTO Conversation(user1_id, user2_id)  VALUES (?, ?)", [user.user_id, recipient_id]);
        rows.push(<RowDataPacket>{
          conversation_id: create.insertId,
          user1_id: user.user_id,
          user2_id: recipient_id
        });
      }
  
      // Insert new message into the conversation
      let [send] = await conn.query<ResultSetHeader>("INSERT INTO Message(content, sender_id, receiver_id, conversation_id) VALUES (?, ?, ?, ?)", [content, user.user_id, recipient_id, rows[0].conversation_id]);
  
      // Prepare new message object
      let newMessage = {
        sender_id: user.user_id,
        recipient_id: recipient_id,
        content: content,
        conversation_id: rows[0].conversation_id // Add conversation ID to new message
      };
  
      // Emit new message event to recipient and sender sockets
      const recipientSocketId = getRecipientSocketId(recipient_id);
      const senderSocketId = getRecipientSocketId(user.user_id);
  
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", newMessage);
      }
  
      if (senderSocketId && senderSocketId !== recipientSocketId) {
        io.to(senderSocketId).emit("newMessage", newMessage);
      }
  
      conn.release();
  
      return res.status(http_status_code.ok).json({ success: true, data: newMessage });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }
  

static async getMessages(req: Request, res: Response) {
  let status: number = http_status_code.serverError;
  let { otheruser } = req.query; // Change to req.query to get parameters from the URL query string
  let user = (req as any).user;

  try {
      let conn = await connect();
      
      // Fetch messages directly based on user IDs
      let qr = "SELECT * FROM Message WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at DESC";
      let [getAll] = await conn.query<RowDataPacket[]>(qr, [user.user_id, otheruser, otheruser, user.user_id]);

      conn.release(); // Release the connection back to the pool

      return res.status(http_status_code.ok).json({
          success: true,
          data: getAll
      });
  } catch (e) {
      return res.status(status).json({
          success: false,
          msg: e instanceof Error ? e.message : e
      });
  }
}


}
