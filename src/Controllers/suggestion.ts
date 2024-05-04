import { Request, Response, NextFunction} from "express";
import http_status_code from "../constant/http_status_code";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";



export default class Suggestion {

  static async ViewSuggestions(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     try{
        let conn =  await connect();
        let qr= `
            SELECT Suggestion.*, User.username AS suggestor_username
            FROM Suggestion
            INNER JOIN User ON Suggestion.user_id = User.user_id
            ORDER BY Suggestion.date ASC
      `;
        let [rows] = await conn.query<RowDataPacket[]>(qr);
        conn.release();
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




  static async deleteSuggestion(req: Request, res: Response)
  {
       let status: number = http_status_code.serverError;
       let {suggestionID} = req.params;
       try{
          let conn = await connect();
          let qr: string = "delete from Suggestion where suggestionID= ?";
          let [deleted] = await conn.query<ResultSetHeader>(qr, [suggestionID]);
          conn.release();
          if(deleted.affectedRows == 0){
             status = http_status_code.bad_request;
             throw new Error("suggestion not deleted");
          }
          return res.status(http_status_code.ok).json({
             success: true,
             msg: "suggestion has deleted"   
          });
       }
       catch(e){
         return res.status(status).json({
         success: false,
         msg: e instanceof Error? e.message : e
       });
     }
   }




  static async createSuggestion(req: Request, res: Response)
  {
       let status: number = http_status_code.serverError;
       let {description} = req.body as { description: string};
       let user = (req as any).user;

       try{
          let conn = await connect();
          let qr: string = "INSERT INTO Suggestion(`description`, `user_id`) VALUES(?, ?)";
          let [create] = await conn.query<ResultSetHeader>(qr, [description, user.user_id]);
          conn.release();
          if(create.affectedRows == 0){
             status = http_status_code.bad_request;
             throw new Error("suggestion create error");
          }
          return res.status(http_status_code.ok).json({
             success: true,
             msg: "suggestion has created"   
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