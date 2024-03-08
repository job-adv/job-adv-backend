import { Request, Response, NextFunction } from 'express';
import connect from '../config/db';
import { RowDataPacket } from 'mysql2';
import http_status_code from '../constant/http_status_code';

export default async function isProfessional(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (user && user.role === 'professional') {
        let qr: string = "select * from User where user_id= ?";
        try{
            let conn = await connect();
            let [row] = await conn.query<RowDataPacket[]>(qr, user.user_id);
            if(row[0].verifier == true) next();

            else return res.status(http_status_code.bad_request).json({ success: false, msg: "you are not verified"})
            
        }catch(e){
             return res.status(http_status_code.serverError).json({
                success: false,
                msg: e instanceof Error? e.message: e
             })
        }
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
}

