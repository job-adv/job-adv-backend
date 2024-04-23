import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";

export default class NotificationController {

  static async view(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;

    try {
      let conn = await connect();
      let qr: string = `
            SELECT n.notification_id, n.content, n.user_id, u.* 
            FROM Notification n
            JOIN User u ON n.receive_user_id = u.user_id
            WHERE n.receive_user_id = ?`;
      let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

      conn.release(); // Release the connection back to the pool

      return res.status(http_status_code.ok).json({
        success: true,
        resultCount: rows.length,
        data: rows
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async delete(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { notification_id } = req.params;

    try {
      let conn = await connect();
      let qr: string = "delete from Notification where notification_id= ?";
      let [deleted] = await conn.query<ResultSetHeader>(qr, [notification_id]);

      conn.release(); // Release the connection back to the pool

      if (deleted.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("notification does not deleted");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "notification deleted successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async create(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { content, receive_user_id } = req.body as { content: string, receive_user_id: number };
    let user = (req as any).user;

    try {
      let conn = await connect();
      let qr: string = "INSERT INTO Notification(`content`, `user_id`, `receive_user_id`) VALUES (?, ?, ?)";
      let [created] = await conn.query<ResultSetHeader>(qr, [content, user.user_id, receive_user_id]);

      conn.release(); // Release the connection back to the pool

      if (created.affectedRows == 0) {
        status: http_status_code.bad_request;
        throw new Error("notification not created error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "notification created successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }
}
