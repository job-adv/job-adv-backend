import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";

export default class CategoryController {

  static async ViewAll(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let conn;

    try {
      conn = await connect();
      let qr: string = "SELECT * FROM Category";
      let [categories] = await conn.query<RowDataPacket[]>(qr);

      for (let i = 0; i < categories.length; i++) {
        let categoryId = categories[i].category_id;
        let qrSub: string = `SELECT * FROM SubCategory WHERE category_id = ${categoryId}`;
        let [subCategories] = await conn.query<RowDataPacket[]>(qrSub);
        categories[i].subcategories = subCategories;
      }

      return res.status(http_status_code.ok).json({
        success: true,
        resultCount: categories.length,
        data: categories
      });
    } catch (e) {
      console.error(e);
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async addCategory(req: Request, res: Response) {
    let { category_name, category_picture, category_icon } = req.body as { category_name: string, category_picture: string, category_icon: string };
    let status: number = http_status_code.serverError;
    let conn;

    try {
      conn = await connect();
      let qr: string = "select * from Category where category_name= ?";
      let [rows] = await conn.query<RowDataPacket[]>(qr, [category_name]);
      if (rows.length != 0) {
        status = http_status_code.bad_request;
        throw new Error("category already exists");
      }

      qr = "INSERT INTO Category (`category_name`, `category_picture`, `category_icon`) VALUES (?, ?, ?)";
      let [add] = await conn.query<ResultSetHeader>(qr, [category_name, category_picture, category_icon]);
      if (add.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("category not added");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "category added successfully"
      });
    } catch (e) {
      console.error(e);
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async updateCategory(req: Request, res: Response) {
    let { category_name, category_picture, category_icon } = req.body as { category_name: string, category_picture: string, category_icon: string };
    let { category_id } = req.params;
    let status: number = http_status_code.serverError;
    let conn;

    try {
      conn = await connect();
      let qr: string;

      if (category_name != "") {
        qr = "select * from Category where category_name= ?";
        let [test] = await conn.query<RowDataPacket[]>(qr, [category_name]);
        if (test.length != 0) {
          status = http_status_code.bad_request;
          throw new Error("Category name already exists");
        }
      }

      qr = "select * from Category where category_id= ?";
      let [row] = await conn.query<RowDataPacket[]>(qr, [category_id]);
      let category = {
        category_name: category_name || row[0].category_name,
        category_picture: category_picture || row[0].category_picture,
        category_icon: category_icon || row[0].category_icon
      };

      qr = "update Category set category_name= ?, category_picture= ?, category_icon= ? where category_id= ?";
      let [updating] = await conn.query<ResultSetHeader>(qr, [category.category_name, category.category_picture, category_icon, category_id]);
      if (updating.affectedRows == 0) {
        status = http_status_code.bad_request;
        throw new Error("Category not updating error");
      }

      return res.status(http_status_code.ok).json({
        success: true,
        msg: "Category updating successfully"
      });
    } catch (e) {
      console.error(e);
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : e
      });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    let { category_id } = req.params;
    let status: number = http_status_code.serverError;
    let conn;

    try {
      conn = await connect();

      let qr: string = "DELETE FROM Category WHERE category_id = ?";
      const [deleted] = await conn.query<ResultSetHeader>(qr, [category_id]);

      if (deleted.affectedRows === 0) {
        status = 400;
        throw new Error("Category not found or already deleted");
      }

      // Update users having this category_id to null
      qr = "UPDATE User SET category_id = NULL WHERE category_id = ?";
      const [updating] = await conn.query<ResultSetHeader>(qr, [category_id]);

      return res.status(200).json({
        success: true,
        msg: "Category deleted successfully"
      });

    } catch (e) {
      console.error(e);
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : "An error occurred"
      });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}
