import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";



export default class UsageCondition {

  static async addUsageConditions(req: Request, res: Response)
  {
      let status: number = http_status_code.serverError;
      let { content } = req.body as { content: string};

      try{
         let conn = await connect();
         let qr: string = "Insert into UsageConditions(`content`) VALUES(?)";
         let [row] = await conn.query<ResultSetHeader>(qr, [content]);
         conn.release();
         if(row.affectedRows == 0){
            status = http_status_code.bad_request;
            throw new Error("UserCondition not added");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "UserCondition added successfully"
         });
      }
      catch(e){
          return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
        });
      }
 }


 static async deleteUsageConditions(req: Request, res: Response)
  {
      let status: number = http_status_code.serverError;
      let { documentID } = req.params;

      try{
         let conn = await connect();
         let qr: string = "delete from UsageConditions where documentID= ?";
         let [row] = await conn.query<ResultSetHeader>(qr, [documentID]);
         conn.release();
         if(row.affectedRows == 0){
            status = http_status_code.bad_request;
            throw new Error("UserCondition not deleted");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "UserCondition deleted successfully"
         });
      }
      catch(e){
          return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
        });
      }
 }


 static async viewAll(req: Request, res: Response)
 {
    let status: number = http_status_code.serverError;
    try{
       let conn =  await connect();
       let qr= "select * from UsageConditions";
       let [rows] = await conn.query<RowDataPacket[]>(qr);
       conn.release();
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

}