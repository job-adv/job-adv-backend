import { Request, Response } from "express";
import http_status_code from "../../constant/http_status_code";
import connect  from "../../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2";



export default class AdminController {


  static async accept_professional(req: Request, res: Response)
  {
       let status: number = http_status_code.serverError;
       let { user_id } = req.body as { user_id: string};

       try{
          let conn = await connect();
          let qr: string = "select * from User where user_id= ?";
          let [row] = await conn.query<RowDataPacket[]>(qr, [user_id]);
          if(row.length<=0){
            status = http_status_code.not_found;
            throw new Error("user not found");
          }

          qr = "update User set verifier= ? where user_id= ?";
          let [update] = await conn.query<ResultSetHeader>(qr, [true, user_id]);
          if(update.affectedRows == 0){
            status = http_status_code.bad_request;
            throw new Error("user not updating");
          }

          return res.status(http_status_code.ok).json({
             success: true,
             msg: "user updating successfully"
          });

       }
       catch(e)
       {
          return res.status(status).json({
            success: false,
            msg: e instanceof Error? e.message : e
          });
       }

  }

}