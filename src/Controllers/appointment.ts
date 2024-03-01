import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";


export default class AppointmentController {


  static async create(req: Request, res: Response)
  {
     let status = http_status_code.serverError;
     let { description , servidce_id, p_id } = req.body as { description: string , servidce_id: number, p_id: number };

     try{
         let conn = await connect();
         let qr: string = "INSERT INTO Appointment(`description`, `service_id`, `p_id`) VALUES (?, ?, ?)";
         let [created] = await conn.query<ResultSetHeader>(qr, [description, servidce_id, p_id]);
         if(created.affectedRows == 0)
         {
           status= http_status_code.bad_request;
           throw new Error("appointment does not created");
         } 

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "appointment created successfully"
         })
     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
    }
  }




  static async update(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { appointment_id, _status, date, time } = req.body as { appointment_id: number, _status: string, date: any, time: any };
     try{
       let conn = await connect();
       let qr: string = "select * from Appointment where appointment_id= ?";
       let [row] = await conn.query<RowDataPacket[]>(qr, [appointment_id]);
       if(row.length <= 0){
           status = http_status_code.not_found;
           throw new Error("this Appointment not found");
       }

       let appointment = {
           status: _status || row[0].status,
           date: date || row[0].date,
           time: time || row[0].time
       }
       qr= "update Appointment set status= ?, date= ?, time= ? where appointment_id= ?";
       let [ updating ] = await conn.query<ResultSetHeader>(qr, [appointment.status, appointment.date, appointment.time, appointment_id]);

       if(updating.affectedRows == 0)
       {
         status = http_status_code.bad_request;
         throw new Error("appointment does not updating");
       }


       return res.status(http_status_code.ok).json({
          success: true,
          msg: "updating successfully"
       })

     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
    }
  }


  // professional queue
  static async ViewCustomAppointment(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;
    try{
       let conn = await connect();
       let qr: string = "select * from Appointment where c_id= ?";
       let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

       return res.status(http_status_code.ok).json({
          success: true,
          number: rows.length,
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



  // customer all appointment
  static async ViewProfessionalAppointment(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;
    try{
       let conn = await connect();
       let qr: string = "select * from Appointment where p_id= ?";
       let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

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


  // delete is update with status = cancelled
}