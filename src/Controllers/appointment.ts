import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";


export default class AppointmentController {


  static async create(req: Request, res: Response)
  {
     let status = http_status_code.serverError;
     let { description , service_id, p_id } = req.body as { description: string , service_id: number, p_id: number };
     let user = (req as any).user;

     try{
         let conn = await connect();
         let qr: string = "INSERT INTO Appointment(`description`, `service_id`, `p_id`, `c_id`) VALUES (?, ?, ?, ?)";
         let [created] = await conn.query<ResultSetHeader>(qr, [description, service_id, p_id, user.user_id]);
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
     let { _status, date, time } = req.body as { _status: string, date: any, time: any };
     let appointment_id = req.params;
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
  static async ViewCustomAppointment(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;

    try {
        let conn = await connect();
        let qr: string = `
            SELECT A.appointment_id, A.description, A.date, A.time, S.service_id, S.title AS service_title, 
                   S.description AS service_description, S.status AS service_status,
                   P.user_id AS professional_id, P.username AS professional_username, 
                   P.firstname AS professional_firstname, P.lastname AS professional_lastname, 
                   P.email AS professional_email, P.role AS professional_role
            FROM Appointment A
            INNER JOIN Service S ON A.service_id = S.service_id
            INNER JOIN User P ON S.user_id = P.user_id
            WHERE A.c_id = ?`;
        let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

        // Transforming the data into the desired format
        let appointments = rows.map(row => ({
            appointment_id: row.appointment_id,
            description: row.description,
            date: row.date,
            time: row.time,
            service: {
                service_id: row.service_id,
                title: row.service_title,
                description: row.service_description,
                status: row.service_status
            },
            professional: {
                user_id: row.professional_id,
                username: row.professional_username,
                firstname: row.professional_firstname,
                lastname: row.professional_lastname,
                email: row.professional_email,
                role: row.professional_role
            }
        }));

        return res.status(http_status_code.ok).json({
            success: true,
            resultCount: appointments.length,
            data: appointments
        });
    } catch (e) {
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
        });
    }
}



 
  static async ViewProfessionalAppointment(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;
    try {
        let conn = await connect();
        let qr: string = `
            SELECT A.appointment_id, A.description, A.date, A.time, S.service_id, S.title AS service_title, 
                   S.description AS service_description, S.status AS service_status,
                   C.user_id AS customer_id, C.username AS customer_username, C.firstname AS customer_firstname, 
                   C.lastname AS customer_lastname, C.email AS customer_email, C.role AS customer_role
            FROM Appointment A
            INNER JOIN User C ON A.c_id = C.user_id
            INNER JOIN Service S ON A.service_id = S.service_id
            WHERE A.p_id = ?`;
        let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

        // Transforming the data into the desired format
        let appointments = rows.map(row => ({
            appointment_id: row.appointment_id,
            description: row.description,
            date: row.date,
            time: row.time,
            service: {
                service_id: row.service_id,
                title: row.service_title,
                description: row.service_description,
                status: row.service_status
            },
            customer: {
                user_id: row.customer_id,
                username: row.customer_username,
                firstname: row.customer_firstname,
                lastname: row.customer_lastname,
                email: row.customer_email,
                role: row.customer_role
            }
        }));

        return res.status(http_status_code.ok).json({
            success: true,
            resultCount: appointments.length,
            data: appointments
        });
    } catch (e) {
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
        });
    }
}


  // delete is update with status = cancelled
}