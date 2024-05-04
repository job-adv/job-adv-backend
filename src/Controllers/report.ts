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
      SELECT Report.*, Reporter.username AS reporter_username, Reported.username AS reported_username
      FROM Report
      INNER JOIN User AS Reporter ON Report.user_id = Reporter.user_id
      INNER JOIN User AS Reported ON Report.reported_id = Reported.user_id
      ORDER BY Report.created_at ASC
    `;
      let [rows] = await conn.query<RowDataPacket[]>(qr);
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
