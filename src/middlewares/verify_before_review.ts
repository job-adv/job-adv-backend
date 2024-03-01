import { Request, Response, NextFunction } from "express";
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";


async function verify_customer (req: Request, res: Response, next: NextFunction)
{
   let status = http_status_code.serverError;
   let {service_id } = req.body as {service_id: string};
   let user = (req as any).user;
   try{

      let conn = await connect();
      let qr: string = "select * from Appointment where status= `completed` and service_id= ? and c_id= ?";
      let [row] = await conn.query<RowDataPacket[]>(qr, [service_id, user.user_id]);
      if(row.length <= 0)
      {
         status: http_status_code.unauthorized;
         throw new Error("you are unauthorized");
      }

      next();

   }
   catch(e){
    return res.status(status).json({
      success: false,
      msg: e instanceof Error? e.message : e
    });
}
}
  