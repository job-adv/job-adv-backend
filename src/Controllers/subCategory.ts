import { Request, Response, NextFunction } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export default class SubCategoryController {

  
  static async viewAll(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    try{
       let conn = await connect();
       let qr: string = "select SubCategory.subCategory_name, SubCategory.category_id, SubCategory.subCategory_picture, SubCategory.subCategory_id, Category.category_name, Category.category_picture from Category, SubCategory where Category.category_id= SubCategory.category_id";
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


  static async addsubCategory(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { subCategory_name, category_id, subCategory_picture } = req.body as { subCategory_name: string, category_id: number, subCategory_picture: string };

     try{
        let conn= await connect();
        let qr = "select * from SubCategory where subCategory_name= ? and category_id= ?";
        let [result] = await conn.query<RowDataPacket[]>(qr, [subCategory_name, category_id]);
        if(result.length != 0){
          status = http_status_code.bad_request;
          throw new Error("subCategory already exist");
        }

        qr = "Insert Into SubCategory(`subCategory_name`, `category_id`, `subCategory_picture`) VALUES(?, ?, ?)";
        let [row] = await conn.query<ResultSetHeader>(qr, [subCategory_name, category_id, subCategory_picture]);
        if(row.affectedRows == 0)
        { 
          status = http_status_code.bad_request;
          throw new Error("subCategory not added");
        }


        return res.status(http_status_code.ok).json({
           success: true,
           msg: "subCategory added successfully"
        });


     }catch(e){
       return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
   } 
 }



 static async deleteSubCategory(req: Request, res: Response)
 {
     let status: number = http_status_code.serverError;
     let { category_id} = req.body as { category_id: number};
     let subCategory_id = req.params;
     try{
         let conn = await connect();
         let qr: string = "select * from SubCategory where subCategory_id= ? and category_id= ?";

         let [result] = await conn.query<RowDataPacket[]>(qr, [subCategory_id, category_id]);
         if(result.length == 0){
            status = http_status_code.not_found;
            throw new Error("subCategory not exist");
         }

         qr = "delete from SubCategory where subCategory_id= ? and category_id= ?";
         let [row] = await conn.query<ResultSetHeader>(qr, [subCategory_id, category_id]);
         if(row.affectedRows == 0)
         {
            status = http_status_code.bad_request;
            throw new Error("subCategory not deleted");
         }

         return res.status(http_status_code.ok).json({
          success: true,
          msg: "subCategory deleted successfully"
       });


     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
    }
    
  }




 static async UpdateSubCategory(req: Request, res: Response)
 {
     let status: number = http_status_code.ok;
     let { subCategory_name, subCategory_picture, category_id } = req.body as { subCategory_name: string , subCategory_picture: string , subCategory_id: number, category_id: number}
     let subCategory_id = req.params;
     try{
        let conn = await connect();
        let qr: string = "select * from subCategory where category_id= ?";
        let [rows] = await conn.query<RowDataPacket[]>(qr, [category_id]);
        rows.map((row)=> {
           if(row.subCategory_name == subCategory_name){
              status = http_status_code.bad_request;
              throw new Error("subCategorie name already exist");
           }
        });
        
        qr = "select * from SubCategory where subCategory_id= ?";
        let [row] = await conn.query<RowDataPacket[]>(qr, [subCategory_id]);
        
        let subCategorie = {
           subCategory_name : subCategory_name ||  row[0].subCategory_name,
           subCategory_picture : subCategory_picture || row[0].subCategory_picture
        }


        qr = "update SubCategory set subCategory_name=?, subCategory_picture=? where subCategory_id= ?";
        let [updating] = await conn.query<ResultSetHeader>(qr, [subCategorie.subCategory_name, subCategorie.subCategory_picture, subCategory_id]);
        if(updating.affectedRows == 0){
           status = http_status_code.bad_request;
           throw new Error("subCategory updating Error");
        }

        return res.status(http_status_code.ok).json({
           success: true,
           msg: "updating successfully"
        });
       

     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
      
    }

 }

}