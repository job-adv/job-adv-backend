import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";



export default class ReportController {

  static async ViewReports(req: Request, res: Response)
  {
      let status: number = http_status_code.serverError;
      try{
         let conn = await connect();
         let qr: string = "select * from Report ORDER BY created_at ASC";
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



 static async deleteReport(req: Request, res: Response)
 {
      let status: number = http_status_code.serverError;
      let {reportID} = req.body as {reportID: number};
      try{
         let conn = await connect();
         let qr: string = "delete from Report where reportID= ?";
         let [deleted] = await conn.query<ResultSetHeader>(qr, [reportID]);

         if(deleted.affectedRows == 0){
            status = http_status_code.bad_request;
            throw new Error("Report not deleted");
         }
         return res.status(http_status_code.ok).json({
            success: true,
            msg: "report has deleted"   
         });
      }
      catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
  }


  static async createReport(req: Request, res: Response)
  {
       let status: number = http_status_code.serverError;
       let {reported_id, description} = req.body as { reported_id: string, description: string};
       let user = (req as any).user;

       try{
          let conn = await connect();
          let qr: string = "INSERT INTO Report(`description`, `user_id`, `reported_id`) VALUES(?, ?, ?)";
          let [create] = await conn.query<ResultSetHeader>(qr, [description, user.user_id, reported_id]);
 
          if(create.affectedRows == 0){
             status = http_status_code.bad_request;
             throw new Error("Report create error");
          }
          return res.status(http_status_code.ok).json({
             success: true,
             msg: "Report has created"   
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