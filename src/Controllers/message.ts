import { Request, Response, NextFunction, response} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";
import { io, getRecipientSocketId } from "../socket/socket";



export default class MessageController {



  static async getConversations(req: Request, res: Response) {
       let status : number = http_status_code.serverError;
       let user =  (req as any).user;
       try {
          let conn = await connect();
          let qr = "SELECT Conversation.*, user.* FROM Conversation JOIN User ON (Conversation.user1_id = User.user_id OR Conversation.user2_id = User.user_id) WHERE (Conversation.user1_id = ? OR Conversation.user2_id = ?) AND User.user_id != ?";
          let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id, user.user_id, user.user_id]);

          return res.status(http_status_code.ok).json({
            success: true,
            data: rows
          })
       } catch (e) {
        return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
       });
    } 
  }



  static async sendMessage(req: Request, res: Response)
  {
    let status : number = http_status_code.serverError;
    let user =  (req as any).user;
    let {recipient_id, content} =  req.body;

    try {
         let conn = await connect();
         let qr = "select * from Conversation where (user1_id= ? and user2_id= ?) OR (user2_id= ? and user1_id= ?)";
         let [row] = await conn.query<RowDataPacket[]>(qr, [user.user_id, recipient_id, recipient_id, user.user_id]);
         if(row.length == 0){
           let [create] = await conn.query<ResultSetHeader>("INSERT INTO Conversation(user1_id, user2_id)  VALUES (?, ?)", [user.user_id, recipient_id]);

           let [search]= await conn.query<RowDataPacket[]>("select * from Conversation where user1_id= ? and user2_id= ?", [user.user_id, recipient_id]);
           row[0]= search[0];
        }

       let [send] = await conn.query<ResultSetHeader>("INSERT INTO Message(content, sender_id , receiver_id ,conversation_id)  VALUES (?, ?, ?, ?)", [content, user.user_id, recipient_id,row[0].conversation_id]);
       const recipientSocketId = getRecipientSocketId(recipient_id);
       let newMessage = {
         sender_id : user.user_id,
         receipent_id: recipient_id,
         content: content,
       }
		   if (recipientSocketId) {
		   io.to(recipientSocketId).emit("newMessage", newMessage);
       res.status(http_status_code.ok).json({success: true, data: newMessage});
		}
      
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
    }
  }




  static async getMessages(req: Request, res: Response) {

    let status : number = http_status_code.serverError;
    let { otheruser } =  req.body;
    let user =  (req as any).user;
    try {
      let conn = await connect();
      let qr = "select * from Conversation where (user1_id= ? and user2_id= ?) OR (user2_id= ? and user1_id= ?)";
      let [row] = await conn.query<RowDataPacket[]>(qr, [user.user_id, otheruser, otheruser, user.user_id]);
      if(row.length == 0) {
        status = http_status_code.not_found;
        throw new Error("conversation not found");
      }

      qr = "select * from Message where conversation_id= ? ORDER BY created_at DESC"
      let [getAll] = await conn.query<RowDataPacket[]>(qr, [row[0].conversation_id]);


      return res.status(http_status_code.ok).json ({
        success: true,
        data: getAll
      })

    }
    catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
    }

  }
} 



