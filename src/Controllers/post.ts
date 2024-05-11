import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";



function localCompare(string1: string, string2?: string) {
   if (!string2) {
       return 1; // Return 1 indicating string1 comes after string2 (assuming non-existent strings come after existing ones)
   }

   const lowerCaseString1 = string1.toLowerCase();
   const lowerCaseString2 = string2.toLowerCase();

   if (lowerCaseString1 < lowerCaseString2) {
       return -1;
   } else if (lowerCaseString1 > lowerCaseString2) {
       return 1;
   } else {
       return 0;
   }
}

export default class special_Request {
   static async view_All_special_Request(req: Request, res: Response) {
       let status: number = http_status_code.serverError;
       let user = (req as any).user;
       let address = user ? user.address : "";

       try {
           let conn = await connect();
           let qr: string = `SELECT Post.user_id, username, firstname, lastname, address, phone_number, profile_picture, post_id, title, Post.created_at AS post_created_at, description, status 
                               FROM User, Post 
                               WHERE User.user_id = Post.user_id`;
           let [rows] = await conn.query<RowDataPacket[]>(qr);
           conn.release();

           if (user) {
               const clientPosts = rows.filter((row) => row.address === address);

               clientPosts.sort((a: any, b: any) => new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime());

               const otherPosts = rows.filter((row) => row.address !== address);

               otherPosts.sort((a: any, b: any) => {
                   if (a.address === b.address) {
                       return new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime();
                   } else {
                       // Use localCompare function here
                       return localCompare(a.address, b.address);
                   }
               });

               rows = clientPosts.concat(otherPosts);
           }

           return res.status(http_status_code.ok).json({
               success: true,
               resultCount: rows.length,
               data: rows
           });
       } catch (e) {
           return res.status(status).json({
               success: false,
               msg: e instanceof Error ? e.message : e
           });
       }
   }


   static async addPost(req: Request, res: Response) {
      let status: number = http_status_code.serverError;
      let user = (req as any).user;
      let { description, title } = req.body as { description: string, title: string };
      try {
         let conn = await connect();
         let qr: string = "INSERT INTO Post(`title`, `description`, `user_id`) VALUES(?, ?, ?)";
         let [row] = await conn.query<ResultSetHeader>(qr, [title, description, user.user_id]);
         conn.release(); 

         if (row.affectedRows == 0) {
            status = http_status_code.bad_request;
            throw new Error("post not save in database");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post added successfully"
         });
      } catch (e) {
         return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
         });
      }
   }

   static async updatePost(req: Request, res: Response) {
      let status: number = http_status_code.serverError;
      let { description, title, _status } = req.body as { description: string, title: string, _status: string };
      let { post_id } = req.params;

      console.log(_status);

      try {
         let conn = await connect();
         let qr: string = "select * from Post where post_id= ?";
         let [row] = await conn.query<RowDataPacket[]>(qr, [post_id]);
         if (row.length == 0) {
            status = http_status_code.not_found;
            throw new Error("post not found");
         }

         let post = {
            title: title || row[0].title,
            description: description || row[0].description,
            _status: _status || row[0].status,
         }

         qr = "update Post set title= ?, description= ?, status= ? where post_id= ?";
         let [updating] = await conn.query<ResultSetHeader>(qr, [post.title, post.description, post._status, post_id]);
         conn.release(); // Release the connection back to the pool

         if (updating.affectedRows == 0) {
            status = http_status_code.bad_request;
            throw new Error("post has not updating");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post updating successfully"
         });
      } catch (e) {
         return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
         });
      }
   }

   static async deletePost(req: Request, res: Response) {
      let status: number = http_status_code.serverError;
      let { post_id } = req.params;
      try {
         let conn = await connect();
         let qr: string = "delete from Post where post_id= ?";
         let [row] = await conn.query<ResultSetHeader>(qr, [post_id]);
         conn.release(); // Release the connection back to the pool

         if (row.affectedRows == 0) {
            status = http_status_code.bad_request;
            throw new Error("post not deleted");
         }

         return res.status(http_status_code.ok).json({
            success: true,
            msg: "post deleted successfully"
         });
      } catch (e) {
         return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
         });
      }
   }

   static async viewAllmyPost(req: Request, res: Response) {
      let status = http_status_code.serverError;
      let user = (req as any).user;
      try {
         let conn = await connect();
         let qr: string = "select * from Post where user_id= ?";
         let [row] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);
         conn.release(); 

         return res.status(http_status_code.ok).json({
            success: true,
            resultCount: row.length,
            data: row
         });
      } catch (e) {
         return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : e
         });
      }
   }
}
