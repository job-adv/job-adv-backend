import { Request, Response, NextFunction } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";




export default class special_Request {


   static async view_All_special_Request(req: Request, res: Response)
   {
       let status: number = http_status_code.serverError;
       
       try{
          let conn = await connect();
          let qr: string = "SELECT Post.user_id, username, firstname, lastname, adress, phone_number, profile_picture, post_id, title, Post.created_at AS post_created_at, description, status FROM User, Post WHERE User.user_id = Post.user_id ORDER BY Post.created_at DESC";
          let [rows] = await conn.query<RowDataPacket[]>(qr);
          
          return res.status(http_status_code.ok).json({
             success: true,
             resultCount: rows.length,
             data: rows
          });
       }
       catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
   }



   static async addPost(req: Request, res:Response)
   {
      let status: number = http_status_code.serverError;
      let user = (req as any).user;
      console.log(user);

      let { description, title } = req.body as { description: string, title: string };
      try{
         let conn= await connect();
         let qr: string = "INSERT INTO Post(`title`, `description`, `user_id`) VALUES(?, ?, ?)";
         let [row] = await conn.query<ResultSetHeader>(qr, [title, description, user.user_id]);
         if(row.affectedRows == 0)
         {
            status= http_status_code.bad_request;
            throw new Error("post not save in database");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post added successfully"
         });
      }
      catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
   }


   


   static async updatePost(req: Request, res:Response)
   {
      let status: number = http_status_code.serverError;
      let { description, title, _status } = req.body as { description: string, title: string, _status: string};
      let post_id = req.params;
  
      try{
         let conn= await connect();
         let qr: string = "select * from Post where post_id= ?";
         let [row] = await conn.query<RowDataPacket[]>(qr, [post_id]);
         if(row.length == 0){
           status= http_status_code.not_found;
           throw new Error("post not found");
         }

         let post = {
            title: title || row[0].title,
            description: description || row[0].description,
            _status: _status || row[0].status,
         }
         
         qr = "update Post set title= ?, description= ?, status= ? where post_id= ?" ;
         let [updating] = await conn.query<ResultSetHeader>(qr, [post.title, post.description, post._status, post_id]);
         if(updating.affectedRows == 0)
         {
            status= http_status_code.bad_request;
            throw new Error("post has not updating");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post updating successfully"
         });
      }
      catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
   }






   static async deletePost(req: Request, res:Response)
   {
      let status: number = http_status_code.serverError;
      let { post_id } = req.params
      try{
         let conn= await connect();
         let qr: string = "delete from Post where post_id= ?";
         let [row] = await conn.query<ResultSetHeader>(qr, [post_id]);
         if(row.affectedRows == 0)
         {
            status= http_status_code.bad_request;
            throw new Error("post not deleted");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post deleted successfully"
         });
      }
      catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }
   }




   static async viewAllmyPost(req: Request, res: Response)
   {
       let status= http_status_code.serverError;
       let user = (req as any).user;
       try{
           let conn = await connect();
           let qr: string = "select * from Post where user_id= ?";
           let [row] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

           return res.status(http_status_code.ok).json({
              success: true,
              resultCount: row.length,
              data: row
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