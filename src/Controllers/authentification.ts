import { Request, Response } from "express";
import { OkPacketParams, ResultSetHeader, RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import connect from "../config/db";
import bcrypt from 'bcrypt';
import * as crypto from "crypto";
import http_status_code from "../constant/http_status_code";
import UserType from "../constant/types";
import { v4 as uuidv4 } from 'uuid';


type Userwithoutuser_id = Omit<UserType, "user_id">


export default class AuthController {


//---------------------------------------------------------------------Signin---------------------------------------------------------------------


    static async signin(req: Request, res: Response) 
    {
         let status: number = http_status_code.serverError;
         let { username, firstname, lastname, role,  email, password, adress } = req.body as Userwithoutuser_id;

         try
         {
             let conn = await connect();

             let qr: string = "select * from User where username= ?"
             let [check] = await conn.query<RowDataPacket[]>(qr, [username]);
             if(check.length != 0){
                status = http_status_code.bad_request;
                throw new Error("username already exist");
             }

             qr = "select * from User where email= ?";
             [check] = await conn.query<RowDataPacket[]>(qr, email);
             if(check.length != 0){
               status = http_status_code.bad_request;
               throw new Error("email already exist");
             }

             let salt: string = bcrypt.genSaltSync(10);
             let hashedPassword: string = bcrypt.hashSync(password, salt);  
             const user_id: string = crypto.randomUUID();
       
             qr = "INSERT INTO `User` (`user_id`, `role`, `username`, `firstname`, `lastname`, `email`, `password`) VALUES (?, ?, ?, ?, ?, ?, ?)";
             let [row] = await conn.query<ResultSetHeader>(qr, [user_id, role, username, firstname, lastname, email, hashedPassword]);

             if(row.affectedRows == 0){
                status = http_status_code.bad_request;
                throw new Error("user not inserted in db");
             }

             let user = {
               user_id: user_id,
               username: username,
               role: role,
               firstname: firstname,
               lastname: lastname,
               email: email,
               adress: adress
             } as Omit<UserType, "password">;


             let access_token_secret: string = process.env.ACCESS_TOKEN_KEY as string;
             let refresh_token_secret: string = process.env.REFRECH_TOKEN_KEY as string;
             
             const access_token = jwt.sign(user, access_token_secret, { expiresIn: "60000" });
             const refrech_token = jwt.sign(user, refresh_token_secret, { expiresIn: "30d" });

             res.cookie("jwt", refrech_token, {
              httpOnly: true,
              secure: true,
              maxAge: 30 * 60 * 60 * 1000,
              sameSite: "none"
            });

            return res.status(http_status_code.ok).json({
              success: true,
              user: user,
              token: access_token
            });
         }
         catch(e)
         {
            return res.status(status).json({
              success: false,
              msg: e instanceof Error? e.message : e
            });
         }
    }

//---------------------------------------------------------------------Login---------------------------------------------------------------------

    static async login(req: Request, res: Response)
    {
      let status: number = http_status_code.serverError;
      let { email, password } = req.body as { email : string, password: string};

      try{

        let conn = await connect();
        let qr: string = "select * from User where email= ?";
        let [rows] = await conn.query<RowDataPacket[]>(qr, [email]);
        if(rows.length <= 0){
          status = http_status_code.bad_request;
          throw new Error("email does not exist");
        }


        let user ={
          user_id: rows[0].user_id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          username: rows[0].username,
          email: rows[0].email,
          role: rows[0].role,
          adress: rows[0].adress
        } as UserType;

        let match = bcrypt.compareSync(password, rows[0].password as string);
        if(!match){
          status= http_status_code.bad_request;
          throw new Error("password not valid");
        }

        let access_token_secret: string = process.env.ACCESS_TOKEN_KEY as string;
        let refresh_token_secret: string = process.env.REFRECH_TOKEN_KEY as string;
        
        const access_token = jwt.sign(user, access_token_secret, { expiresIn: "60000" });
        const refrech_token = jwt.sign(user, refresh_token_secret, { expiresIn: '30d' });

        res.cookie("jwt", refrech_token, {
         httpOnly: true,
         secure: true,
         maxAge: 30 * 24* 60 * 60 * 1000,
         sameSite: "none"
       });

       return res.status(http_status_code.ok).json({
         success: true,
         user: user,
         token: access_token
       });

      }
      catch(e)
      {
        return res.status(status).json({
          success: false,
          msg: e instanceof Error? e.message : e
        })
      }

    }


//---------------------------------------------------------------------Logout---------------------------------------------------------------------

    static async logout(req: Request, res: Response) {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.status(204).json({ sucess: false, msg: "No cookies" });
      }
    
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
    
      res.status(200).json({
        success: true,
        msg: "Logout successfully"
       });
    }


}