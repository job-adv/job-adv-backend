import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";


export default class Historique {


    static async View(req: Request, res: Response)
    {
      let status:number = http_status_code.serverError;
      let user = (req as any).user;
      try{
        let conn = await connect();
        let qr: string = "select * from Appointment where c_id= ? OR p_id= ?";
        let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id, user.user_id]);

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
