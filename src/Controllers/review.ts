import { Request, Response, NextFunction} from "express";
import http_status_code from '../constant/http_status_code';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db"; 



export default class ReviewController {


  static async addReview(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { comment , rating, service_id } = req.body as { comment: string , rating: number , service_id: number };
     try{
        let conn = await connect();
        let qr: string = "INSERT INTO Review(`comment`, `rating`, `service_id`) VALUES (?, ?, ?)";
        let [added] = await conn.query<ResultSetHeader>(qr, [comment, rating, service_id]);
        if(added.affectedRows == 0)
        {
           status = http_status_code.bad_request;
           throw new Error("Review not added error");
        }

        return res.status(http_status_code.ok).json({
          success: true,
          msg: "Review added successfully"
        })
     }catch(e)
     {
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
   }
  }



  static async deleteReview(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { review_id } = req.body as { review_id: number};
     try{
        let conn = await connect();
        let qr: string = "delete from Review where review_id= ?";
        let [deleted] = await conn.query<ResultSetHeader>(qr, [review_id]);
        if(deleted.affectedRows == 0)
        {
           status = http_status_code.bad_request;
           throw new Error("Review not deleted error");
        }

        return res.status(http_status_code.ok).json({
          success: true,
          msg: "Review deleted successfully"
        })
     }catch(e)
     {
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
   }
  }
    


  static async UpdateReview(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { review_id, comment , rating } = req.body as {review_id: number, comment: string , rating: number , service_id: number };
     try{
        let conn = await connect();
        let qr: string = "select * from Review where review_id= ?";
        let [row] = await conn.query<RowDataPacket[]>(qr, [review_id]);
       
        let review = {
           comment: comment || row[0].comment,
           rating: rating || row[0].rating,
        }

        qr = "update Review set comment= ? , rating= ? where review_id= ?";
        let [updating] = await conn.query<ResultSetHeader>(qr, [review.comment, review.rating, review_id]);
        
        if(updating.affectedRows == 0)
        {
          status = http_status_code.bad_request;
          throw new Error("Review not updating error");
        }

        return res.status(http_status_code.ok).json({
          success: true,
          msg: "Review updating successfully"
        })
     }catch(e)
     {
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
   }
  }



  static async ViewAll(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { service_id } = req.body as { service_id: number}
     try{
        let conn = await connect();
        let qr: string = "selet * from Review where service_id= ?";
        let [rows] = await conn.query<RowDataPacket[]>(qr, [service_id]);


        return res.status(http_status_code.ok).json({
          success: true,
          resultCount: rows.length,
          data: rows
        })
     }catch(e)
     {
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
     });
   }
  }
  
}