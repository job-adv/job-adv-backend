import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";


export default class Historique {


  static async View(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let user = (req as any).user;
    try {
        let conn = await connect();
        let qr: string = `
            SELECT 
                a.appointment_id, 
                a.description, 
                a.service_id, 
                cu.user_id AS customer_id,
                cu.firstname AS customer_firstname,
                cu.lastname AS customer_lastname,
                cu.email AS customer_email,
                cu.username AS customer_username,
                pr.user_id AS professional_id,
                pr.firstname AS professional_firstname,
                pr.lastname AS professional_lastname,
                pr.email AS professional_email,
                pr.username AS professional_username,
                a.status, 
                a.date, 
                a.time 
            FROM 
                Appointment a
                LEFT JOIN User cu ON a.c_id = cu.user_id
                LEFT JOIN User pr ON a.p_id = pr.user_id
            WHERE 
                a.c_id = ? OR a.p_id = ?`;
        let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id, user.user_id]);

        const data = rows.map(row => ({
            appointment_id: row.appointment_id,
            description: row.description,
            service_id: row.service_id,
            customer: {
                user_id: row.customer_id,
                firstname: row.customer_firstname,
                lastname: row.customer_lastname,
                email: row.customer_email,
                username: row.customer_username,
            },
            professional: {
                user_id: row.professional_id,
                firstname: row.professional_firstname,
                lastname: row.professional_lastname,
                email: row.professional_email,
                username: row.professional_username,
            },
            status: row.status,
            date: row.date,
            time: row.time
        }));

        return res.status(http_status_code.ok).json({
            success: true,
            resultCount: rows.length,
            data: data
        });

    } catch (e) {
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
        });
    }
}

}
