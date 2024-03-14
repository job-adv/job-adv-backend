import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";



export default class CategoryController {




  static async ViewAll(req: Request, res: Response)
  {
      let status: number = http_status_code.serverError;
      try{
          let conn = await connect();
          let qr: string = "select * from Category";
          let [rows] = await conn.query<RowDataPacket[]>(qr);

          return res.status(http_status_code.ok).json({
             success: true,
             resultCount: rows.length,
             data: rows
          })

      }
      catch(e){
       return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
     }
  }


  static async addCategory(req: Request, res: Response)
  {
     let { category_name, category_picture } = req.body as { category_name: string, category_picture: string};
     let status: number = http_status_code.serverError;
     try{
         let conn = await connect();
         let qr: string = "select * from category where category_name= ?";
         let [rows] = await conn.query<RowDataPacket[]>(qr, [category_name]);
         if(rows.length != 0){
           status = http_status_code.bad_request;
           throw new Error("category already exist"); 
         }

         qr = "INSERT INTO Category (`category_name`, `category_picture`) VALUES (?, ?)";
         let [add] = await conn.query<ResultSetHeader>(qr, [category_name, category_picture]);
         if(add.affectedRows == 0){
          status = http_status_code.bad_request;
          throw new Error("gategory does not added"); 
         }

         return res.status(http_status_code.ok).json({
             success: true,
             msg: "category added successfully"
         })
     }catch(e){
       return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
     }
  }



  static async updateCategory(req: Request, res: Response)
  {
      let { category_name, category_picture } = req.body as { category_name: string , category_picture: string}
      let {category_id} = req.params;
      let status: number = http_status_code.serverError;

      try{
          let conn = await connect();
          let qr: string;

          if(category_name != "")
          {
             qr ="select * from category where category_name= ?";
             let [test] = await conn.query<RowDataPacket[]>(qr, [category_name]);
             if(test.length != 0){
               status = http_status_code.bad_request;
               throw new Error("Cateory name alredy exist");
             }
          }

          qr = "select * from category where category_id= ?";
          let [row] = await conn.query<RowDataPacket[]>(qr, [category_id]);
          let category = {
              category_name : category_name || row[0].category_name,
              category_picture : category_picture || row[0].category_picture
          };

          qr = "update Category set category_name= ?, category_picture= ? where category_id= ?";
          let [updating] = await conn.query<ResultSetHeader>(qr, [category.category_name, category.category_picture, category_id]);
          if(updating.affectedRows == 0)
          {
            status = http_status_code.bad_request;
            throw new Error("Cateory not updating error");
          }

          return res.status(http_status_code.ok).json({
            success: true,
            msg: "Category updating successfully"
          })

      }
      catch(e){
         return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
        });
       }
  }



  static async deleteCategory(req: Request, res: Response) {
    let { category_id } = req.params;
    let status: number = http_status_code.serverError;

    try {
        const conn = await connect();
        
        
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
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : "An error occurred"
        });
    }
}


}