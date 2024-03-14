import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";



export default class CategoryController {


  static async addPicture(req: Request, res: Response)
  {
      let status = http_status_code.serverError;
      let {link, service_id} = req.body as {link: string, service_id: Number};
      try{
        let conn = await connect();
        let qr: string = "INSERT INTO Picture(`link`, `service_id`) VALUES (?, ?)";
        let [add] = await conn.query<ResultSetHeader>(qr, [link, service_id]);
        if(add.affectedRows == 0)
        {
           status= http_status_code.bad_request;
           throw new Error("picture does not added");
        }

        return res.status(http_status_code.ok).json({
           success: true,
           msg: "picture added successfully"
        });

      }
      catch(e){
        return res.status(status).json({
         success: false,
         msg: e instanceof Error? e.message : e
       });
      }
  }

  


  static async deletePicture(req: Request, res: Response)
  {
      let status = http_status_code.serverError;
      let { picture_id } = req.params;
      try{
          let conn = await connect();
          let qr: string = "delete from Picture where picture_id= ?";
          let [deleted] = await conn.query<ResultSetHeader>(qr, [picture_id]);
          if(deleted.affectedRows == 0)
          {
             status= http_status_code.bad_request;
             throw new Error("picture does not deleted");
          }
  
          return res.status(http_status_code.ok).json({
             success: true,
             msg: "picture deleted successfully"
          });
      }
      catch(e){
        return res.status(status).json({
         success: false,
         msg: e instanceof Error? e.message : e
       });
      }
  }



  static async View(req: Request, res: Response)
  {
      let status = http_status_code.serverError;
      let { service_id } = req.body as { service_id: string };
      try{
          let conn = await connect();
          let qr: string = "select * from Picture where service_id= ?";
          let [rows] = await conn.query<RowDataPacket[]>(qr, [service_id]);
  
          return res.status(http_status_code.ok).json({
             success: true,
             resultCount: rows.length,
             data: rows
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