import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export default class PriceController {

  static async addPrice(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { value, description, rate, service_id } = req.body as { value: number, description: string, rate: string, service_id: number };

    try {
      let conn = await connect();
      let qr: string = "INSERT INTO Price(`value`, `description`, `rate`, `service_id`) VALUES (?, ?, ?, ?)";
      let [row] = await conn.query<ResultSetHeader>(qr, [value, description, rate, service_id]);
      conn.release(); // Release the connection back to the pool

      if (row.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("price not saved in the database");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "price added successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async updatePrice(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { value, description, rate } = req.body as { value: number, description: string, rate: string };
    let { price_id } = req.params;

    try {
      let conn = await connect();
      let qr: string = "SELECT * FROM Price WHERE price_id = ?";
      let [row] = await conn.query<RowDataPacket[]>(qr, [price_id]);
      if (row.length == 0) {
        status = http_status_code.not_found;
        throw new Error("price not found");
      }

      let price = {
        value: value || row[0].value,
        description: description || row[0].description,
        rate: rate || row[0].rate,
      }

      qr = "UPDATE Price SET value = ?, description = ?, rate = ? WHERE price_id = ?";
      let [updating] = await conn.query<ResultSetHeader>(qr, [price.value, price.description, price.rate, price_id]);
      conn.release(); // Release the connection back to the pool

      if (updating.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("price has not been updated");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "price updated successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }

  static async deletePrice(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { price_id } = req.params;
    try {
      let conn = await connect();
      let qr: string = "DELETE FROM Price WHERE price_id = ?";
      let [row] = await conn.query<ResultSetHeader>(qr, [price_id]);
      conn.release(); // Release the connection back to the pool

      if (row.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("price not deleted");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "price deleted successfully"
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    }
  }
}
