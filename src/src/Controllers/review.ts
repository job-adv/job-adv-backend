import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export default class ReviewController {

  static async addReview(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { comment, rating, service_id } = req.body as { comment: string, rating: number, service_id: number };
    try {
      let conn = await connect();
      let qr: string = "INSERT INTO Review(`comment`, `rating`, `service_id`) VALUES (?, ?, ?)";
      let [added] = await conn.query<ResultSetHeader>(qr, [comment, rating, service_id]);
      conn.release(); // Release the connection back to the pool

      if (added.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Review not added error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "Review added successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async deleteReview(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { review_id } = req.params;
    try {
      let conn = await connect();
      let qr: string = "DELETE FROM Review WHERE review_id = ?";
      let [deleted] = await conn.query<ResultSetHeader>(qr, [review_id]);
      conn.release(); // Release the connection back to the pool

      if (deleted.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Review not deleted error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "Review deleted successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async UpdateReview(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { comment, rating } = req.body as { comment: string, rating: number };
    let { review_id } = req.params;
    try {
      let conn = await connect();
      let qr: string = "SELECT * FROM Review WHERE review_id = ?";
      let [row] = await conn.query<RowDataPacket[]>(qr, [review_id]);
      conn.release(); // Release the connection back to the pool

      let review = {
        comment: comment || row[0].comment,
        rating: rating || row[0].rating,
      };

      qr = "UPDATE Review SET comment = ?, rating = ? WHERE review_id = ?";
      let [updating] = await conn.query<ResultSetHeader>(qr, [review.comment, review.rating, review_id]);

      if (updating.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Review not updating error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "Review updating successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async ViewAll(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { service_id } = req.params;
    try {
      let conn = await connect();
      let qr: string = "SELECT * FROM Review WHERE service_id = ?";
      let [rows] = await conn.query<RowDataPacket[]>(qr, [service_id]);
      conn.release();

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
}
