import { Request, Response, NextFunction} from "express";
import http_status_code from '../constant/http_status_code';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";  


export default class favoriteController {


  static async addFavorite(req: Request, res: Response)
  {
       let status: number = http_status_code.serverError;
       let { post_id } = req.body as { post_id: number};
       let user = (req as any).user;

       try{
           let conn = await connect();
           let qr: string = "INSERT INTO Favorite(`post_id`, `user_id`) VALUES (?, ?)";
           let [add] = await conn.query<ResultSetHeader>(qr, [post_id, user.user_id]);

           if(add.affectedRows == 0)
           {
              status= http_status_code.bad_request;
              throw new Error("favorite not added");
           }

           return res.status(http_status_code.ok).json({
              success: true,
              msg: "add post to favorite successfully"
           })
       }
       catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
  }


  static async deleteFavorite(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    let { favorite_id } = req.body as { favorite_id: number};
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



  static async ViewAllFavorite(req: Request, res: Response)
  {
      let status:number = http_status_code.serverError;
      let user = (req as any).user_id;
      try{
          let conn = await connect();
          let qr: string = "select * from Favorite where user_id= ?";
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

}