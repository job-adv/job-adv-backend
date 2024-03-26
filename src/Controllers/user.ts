import { Request, Response, NextFunction } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import http from 'http';




export default class UsereController {
      


  static async allUser(req: Request, res: Response)
  {
   
      let status: number = http_status_code.serverError;
      try{
          let conn = await connect();
          let qr: string = "select * from User ORDER BY created_at DESC";
          let [rows] = await conn.query<RowDataPacket[]>(qr);

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
  

  
  static async allProfessional(req: Request, res: Response)
  {
   
      let status: number = http_status_code.serverError;
      try{
          let conn = await connect();
          let qr: string = "select username, lastname, username, phone_number, adress, category_id, category_name from User, Category where role=`professional` and User.category_id= Category.category_id ORDER BY created_at DESC";
          let [rows] = await conn.query<RowDataPacket[]>(qr);

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



  static async updateUser(req: Request, res: Response)
    {
        let {firstname, lastname, adress, phone_number, instagram_link, tiktok_link, facebook_link, profile_picture, disponible} = req.body as {
            
          firstname: String,
          lastname: string,
          email: string,
          adress: string,
          phone_number: string,
          instagram_link: string,
          tiktok_link: string,
          facebook_link: string,
          profile_picture: string,
          disponible: boolean
        };

        let status: number = http_status_code.serverError;
        let user = (req as any).user;


        try{
           let conn = await connect();
           let qr: string = "select * from User where user_id= ?";
           let [row] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);
           
           let profile = {
              firstname: firstname || row[0].firstname,
              lastname: lastname || row[0].lastname,
              adress: adress || row[0].adress,
              phone_number: phone_number || row[0].phone_number,
              instagram_link: instagram_link || row[0].instagram_link,
              tiktok_link: tiktok_link || row[0].tiktok_link,
              facebook_link: facebook_link || row[0].facebook_link,
              profile_picture: profile_picture || row[0].profile_picture,
              disponible : disponible || row[0].disponible
           }

           qr = "UPDATE User set firstname= ?, lastname=?, adress=?, phone_number=?, instagram_link=?, tiktok_link=?, facebook_link=?, profile_picture=?, disponible= ? where user_id= ?";
           let [updating] = await conn.query<ResultSetHeader>(qr, [profile.firstname, profile.lastname, profile.adress, profile.phone_number, profile.instagram_link, profile.tiktok_link, profile.facebook_link, profile.profile_picture, disponible, user.user_id]);
           if(updating.affectedRows == 0)
           {
              status = http_status_code.bad_request;
              throw new Error("updating failed");
           }

           return res.status(http_status_code.ok).json({
              success: true,
              msg: "updating successfully" 
           });
        } 
        catch(e){
        return res.status(status).json({
        success: false,
        msg: e instanceof Error? e.message : e
      });
    }    
  }



  static async deleteUser(req: Request, res: Response)
  {
    let status: number = http_status_code.serverError;
    let { user_id } = req.params;

    try{
       let conn = await connect();
       let qr: string = "select * from User where user_id= ?";
       let [row] = await conn.query<RowDataPacket[]>(qr, [user_id]);
       if(row.length<=0){
         status = http_status_code.not_found;
         throw new Error("user not found");
       }

       qr = "delete from User where user_id= ?";
       let [result] = await conn.query<ResultSetHeader>(qr, [user_id]);
       if(result.affectedRows == 0)
       {
          status = http_status_code.bad_request;
          throw new Error("user does not deleted successfully");
       }

       return res.status(http_status_code.ok).json({
          success: true,
          msg: "user deleted successfully" 
       });
    }
    catch(e){
        return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
        });
    }
  }



  static async updateUserCategory(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let {category_id, cv } = req.body;
     let user = (req as any).user;
     try{
        let conn = await connect();
        let qr = "select * from Category where category_id = ?";
        let [row] = await conn.query<RowDataPacket[]>(qr, [category_id]);
        if(row.length == 0){
          status = http_status_code.bad_request;
          throw new Error("that's category doesn't exist");
        }

        qr = "Update User set category_id= ?, cv= ?, verifier= ? where user_id= ?";
        let [updated] = await conn.query<ResultSetHeader>(qr, [category_id, cv, false]);

        if(updated.affectedRows == 0){
          status = http_status_code.bad_request;
          throw new Error("updating failed");
        }

        return res.status(http_status_code.ok).json({
          success: true,
          msg: "updating successfully"
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