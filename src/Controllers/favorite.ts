import { Request, Response, NextFunction} from "express";
import http_status_code from '../constant/http_status_code';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";  


export default class favoriteController {


  static async addFavorite(req: Request, res: Response) {
    let status: number = http_status_code.serverError;
    let { service_id } = req.body as { service_id: number };
    let user = (req as any).user;

    try {
        console.log(user.user_id)
        let conn = await connect();
        let qr: string = "INSERT INTO Favorite (service_id, user_id) VALUES (?, ?)";
        let [add] = await conn.query<ResultSetHeader>(qr, [service_id, user.user_id]);

        if (add.affectedRows == 0) {
            status = http_status_code.bad_request;
            throw new Error("Favorite not added");
        }

        return res.status(http_status_code.ok).json({
            success: true,
            msg: "service added to favorites successfully"
        });
    } catch (e) {
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
        });
    }
}


  static async deleteFavorite(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    let { favorite_id } = req.params;
    let user = (req as any).user;

    try{
        let conn = await connect();
        let qr: string = "delete from Favorite where favorite_id= ? and user_id= ?";
        let [deleted] = await conn.query<ResultSetHeader>(qr, [favorite_id, user.user_id]);

        if(deleted.affectedRows == 0)
        {
           status= http_status_code.bad_request;
           throw new Error("favorite not deleted");
        }
        return res.status(http_status_code.ok).json({
           success: true,
           msg: "favorite deleted successfully"
        })
    }
    catch(e){
     return res.status(status).json({
     success: false,
     msg: e instanceof Error? e.message : e
   });
  }
 }



 static async ViewAllFavorite(req: Request, res: Response) {
  let status: number = http_status_code.serverError;
  let user = (req as any).user;

  try {
      let conn = await connect();
      let qr: string = `
          SELECT F.favorite_id, S.service_id, S.title AS service_title, 
                 S.description AS service_description, S.status AS service_status,
                 P.user_id AS professional_id, P.username AS professional_username, 
                 P.firstname AS professional_firstname, P.lastname AS professional_lastname, 
                 P.email AS professional_email, P.role AS professional_role
          FROM Favorite F
          INNER JOIN Service S ON F.service_id = S.service_id
          INNER JOIN User P ON S.user_id = P.user_id
          WHERE F.user_id = ?`;
      let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

      let favorites = rows.map(row => ({
          favorite_id: row.favorite_id,
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
          resultCount: favorites.length,
          data: favorites
      });
  } catch (e) {
      return res.status(status).json({
          success: false,
          msg: e instanceof Error ? e.message : e
      });
  }
}

}