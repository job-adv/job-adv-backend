import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export default class ReportController {

  static async ViewReports(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    try {
      let conn = await connect();
      let qr: string = `
      SELECT 
      R.reportID,
      R.description,
      R.created_at,
      R.user_id AS reporter_user_id,
      RU.username AS reporter_username,
      U.user_id AS reported_user_id,
      U.username AS reported_username
      FROM 
          Report R
      JOIN 
          User RU ON R.user_id = RU.user_id -- Join to get reporting user's username
      JOIN 
          Service S ON R.reported_id = S.service_id -- Join to get the reported user's service
      JOIN 
          User U ON S.user_id = U.user_id
`;
      let [rows] = await conn.query<RowDataPacket[]>(qr);

      qr = "select * from Report ORDER BY created_at ASC";
      let [rows2] = await conn.query<RowDataPacket[]>(qr);
      conn.release(); 

      return res.status(http_status_code.ok).json({
        success: true,
        resultCount: rows.length,
        data: rows,
        data2: rows2
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async deleteReport(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { reportID } = req.params;
    try {
      let conn = await connect();
      let qr: string = "DELETE FROM Report WHERE reportID = ?";
      let [deleted] = await conn.query<ResultSetHeader>(qr, [reportID]);
      conn.release(); // Release the connection back to the pool

      if (deleted.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Report not deleted");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "report has been deleted"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async createReport(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { reported_id, description } = req.body as { reported_id: string, description: string };
    let user = (req as any).user;

    try {
      let conn = await connect();
      let qr: string = "INSERT INTO Report(`description`, `user_id`, `reported_id`) VALUES (?, ?, ?)";
      let [create] = await conn.query<ResultSetHeader>(qr, [description, user.user_id, reported_id]);
      conn.release(); // Release the connection back to the pool

      if (create.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Report creation error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "Report has been created"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }
}
