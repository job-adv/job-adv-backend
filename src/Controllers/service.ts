import { Request, Response, NextFunction, RequestParamHandler} from "express";
import http_status_code from '../constant/http_status_code';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connect from "../config/db";

interface Price {
    value: number;
    description: string;
    rate: string;
  }

interface Picrure {
    link: string;
}

export default class ServiceController {


  static async viewAll(req: Request, res: Response) {
    let status: number = http_status_code.serverError;

    try {
        const { subCategory_id } = req.body as { subCategory_id: string };

        const conn = await connect();
        const qr: string = "SELECT User.user_id, User.firstname, User.lastname, User.phone_number, User.instagram_link, User.facebook_link, User.tiktok_link, User.profile_picture, Service.*, Price.price_id, Price.value AS value, Picture.picture_id, Picture.link AS link FROM User JOIN Service ON Service.user_id = User.user_id LEFT JOIN Picture ON Service.service_id = Picture.service_id LEFT JOIN Price ON Service.service_id = Price.service_id WHERE Service.subCategory_id = ? AND Service.service_id IS NOT NULL GROUP BY Service.service_id, Picture.picture_id, Price.price_id ORDER BY Service.created_at DESC";
        const [rows] = await conn.query<RowDataPacket[]>(qr, [subCategory_id]);


        const result: any = {};
        rows.forEach((row: any) => {
           if (!result[row.service_id]) {
               result[row.service_id] = {
                   service_id: row.service_id,
                   user: {
                       user_id: row.user_id,
                       username: row.username,
                       firstname: row.firstname, 
                       lastname: row.lastname,
                       adress: row.adress,
                       phone_number: row.phone_number
                   },
                   pictures: [],
                   prices: []
               };
           }
       
           // Check if the picture exists for the service
           const pictureExists = result[row.service_id].pictures.some((pic: any) => pic.picture_id === row.picture_id);
           if (row.picture_id && !pictureExists) {
               result[row.service_id].pictures.push({
                   picture_id: row.picture_id,
                   link: row.link
               });
           }
       
           // Check if the price exists for the service
           const priceExists = result[row.service_id].prices.some((pri: any) => pri.price_id === row.price_id);
           if (row.price_id && !priceExists) {
               result[row.service_id].prices.push({
                   price_id: row.price_id,
                   value: row.value,
                   description: row.description,
                   rate: row.rate
               });
           }
       });

        // Convert object to array
        const finalResult = Object.values(result);

        return res.status(http_status_code.ok).json({
            success: true,
            resultCount: finalResult.length,
            data: finalResult
        });
    } catch (e) {
        return res.status(status).json({
            success: false,
            msg: e instanceof Error ? e.message : "An error occurred"
        });
    }
}


  static async viewAllmyService(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let user = (req as any).user;
     console.log(user.user_id);
     try{
       let conn = await connect();
       let qr: string ="SELECT User.user_id, User.firstname, User.lastname, User.adress, User.phone_number, User.instagram_link, User.facebook_link, User.tiktok_link, User.profile_picture, Service.*, Price.price_id, Price.value AS value, Picture.picture_id, Picture.link AS link FROM User JOIN Service ON Service.user_id = User.user_id LEFT JOIN Picture ON Service.service_id = Picture.service_id LEFT JOIN Price ON Service.service_id = Price.service_id WHERE Service.user_id= ? AND Service.service_id IS NOT NULL GROUP BY Service.service_id, Picture.picture_id, Price.price_id ORDER BY Service.created_at DESC";

       let [rows] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);

       console.log(rows);
       const result: any = {};
       rows.forEach((row: any) => {
           if (!result[row.service_id]) {
               result[row.service_id] = {
                   service_id: row.service_id,
                   user: {
                       user_id: row.user_id,
                       username: row.username,
                       firstname: row.firstname, 
                       lastname: row.lastname,
                       adress: row.adress,
                       phone_number: row.phone_number
                   },
                   pictures: [],
                   prices: []
               };
           }
       
           // Check if the picture exists for the service
           const pictureExists = result[row.service_id].pictures.some((pic: any) => pic.picture_id === row.picture_id);
           if (row.picture_id && !pictureExists) {
               result[row.service_id].pictures.push({
                   picture_id: row.picture_id,
                   link: row.link
               });
           }
       
           // Check if the price exists for the service
           const priceExists = result[row.service_id].prices.some((pri: any) => pri.price_id === row.price_id);
           if (row.price_id && !priceExists) {
               result[row.service_id].prices.push({
                   price_id: row.price_id,
                   value: row.value,
                   description: row.description,
                   rate: row.rate
               });
           }
       });

        // Convert object to array
        const finalResult = Object.values(result);
       

       return res.status(http_status_code.ok).json({
        success: true,
        resultCount: finalResult.length,
        data: finalResult,
       });
     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
    }
  }

  

  static async Oneservice(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { service_id } = req.params ;
           
     try {
       let conn = await connect();
       let qr: string = "SELECT User.user_id, User.firstname, User.lastname, User.adress, User.phone_number, User.instagram_link, User.facebook_link, User.tiktok_link, User.profile_picture, Service.*, Price.price_id, Price.value AS value, Picture.picture_id, Picture.link AS link FROM User JOIN Service ON Service.user_id = User.user_id LEFT JOIN Picture ON Service.service_id = Picture.service_id LEFT JOIN Price ON Service.service_id = Price.service_id WHERE Service.service_id = ? AND Service.service_id IS NOT NULL GROUP BY Service.service_id, Picture.picture_id, Price.price_id ORDER BY Service.created_at DESC";
       let [rows] = await conn.query<RowDataPacket[]>(qr, [service_id]);
       const result: any = {};
       rows.forEach((row: any) => {
           if (!result[row.service_id]) {
               result[row.service_id] = {
                   service_id: row.service_id,
                   user: {
                       user_id: row.user_id,
                       username: row.username,
                       firstname: row.firstname, 
                       lastname: row.lastname,
                       adress: row.adress,
                       phone_number: row.phone_number
                   },
                   pictures: [],
                   prices: []
               };
           }
       
           // Check if the picture exists for the service
           const pictureExists = result[row.service_id].pictures.some((pic: any) => pic.picture_id === row.picture_id);
           if (row.picture_id && !pictureExists) {
               result[row.service_id].pictures.push({
                   picture_id: row.picture_id,
                   link: row.link
               });
           }
       
           // Check if the price exists for the service
           const priceExists = result[row.service_id].prices.some((pri: any) => pri.price_id === row.price_id);
           if (row.price_id && !priceExists) {
               result[row.service_id].prices.push({
                   price_id: row.price_id,
                   value: row.value,
                   description: row.description,
                   rate: row.rate
               });
           }
       });

        // Convert object to array
        const finalResult = Object.values(result);
       
       return res.status(http_status_code.ok).json({
         success: true,
         data: finalResult[0]
       });
     }
     catch(e){
      return res.status(status).json({
       success: false,
       msg: e instanceof Error? e.message : e
     });
    }

  }



  static async create(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { title, description, subCategory_id, pictures, prices} = req.body as { title: string, description: string, subCategory_id: number, pictures:Picrure[], prices: Price[] }
     let user = (req as any).user;

     try {
        const conn = await connect();
        let qr: string = "select * from Service where user_id= ?";
        const [verify] = await conn.query<RowDataPacket[]>(qr, [user.user_id]);
        if (verify.length >= 1)
          return res
            .status(http_status_code.bad_request)
            .json({ success: false, msg: "you have already one service in this subCategory" });
    
        qr = "INSERT INTO Service(`title`, `description`, `user_id`, `subCategory_id`) VALUES(?, ?, ?, ?)";
        const [created] = await conn.query<ResultSetHeader>(qr, [title, description, user.user_id, subCategory_id]);
    
        if (created.affectedRows === 0) {
          status = http_status_code.bad_request;
          throw new Error("service not created error");
        }
    
        qr = "select * from Service where title= ? and description= ? and subCategory_id= ?";
        const [row] = await conn.query<RowDataPacket[]>(qr, [title, description, subCategory_id]);
        const service_id = row[0].service_id;
    
        if (prices.length !== 0) {
          qr = "INSERT INTO Price(value, description, rate, service_id) VALUES (?, ?, ?, ?)";
          for (const price of prices) {
            await conn.query<ResultSetHeader>(qr, [price.value, price.description, price.rate, service_id]);
          }
        }
    
        if (pictures.length !== 0) {
          qr = "INSERT INTO Picture(link, service_id) VALUES (?, ?)";
          for (const picture of pictures) {
            await conn.query<ResultSetHeader>(qr, [picture.link, service_id]);
          }
        }
    
        return res.status(http_status_code.ok).json({
          success: true,
          msg: "service created successfully"
        });
      } catch (e) {
        return res.status(status).json({
          success: false,
          msg: e instanceof Error ? e.message : e
        });
      }

  }



  static async UpdateService(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { service_id} = req.params ;
     let { title, description, _status} = req.body as { title: string , description: string, _status: string };
           
     try {
       let conn = await connect();
       let qr: string = "select * from Service where service_id= ?";
       let [row] = await conn.query<RowDataPacket[]>(qr, [service_id]);

       let service = {
          title: title || row[0].title,
          description: description || row[0].description,
          _status: _status || row[0].status
       }

       qr = "update Service set title= ?, description= ?, status: ? where service_id = ?";
       let [updating] = await conn.query<ResultSetHeader>(qr, [service.title, service.description, service._status, service_id]);
       if(updating.affectedRows == 0)
       {
          status: http_status_code.bad_request;
          throw new Error("Upadating error");
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


  
  static async deleteService(req: Request, res: Response)
  {
     let status: number = http_status_code.serverError;
     let { service_id } = req.params;
     try{
      let conn = await connect();
      let qr: string = "select * from Service where service_id= ?";
      let [row] = await conn.query<RowDataPacket[]>(qr, [service_id]);
      if(row.length<=0){
        status = http_status_code.not_found;
        throw new Error("service not found");
      }

      qr = "delete from Service where service_id= ?";
      let [result] = await conn.query<ResultSetHeader>(qr, [service_id]);
      if(result.affectedRows == 0)
      {
         status = http_status_code.bad_request;
         throw new Error("service does not deleted successfully");
      }

      return res.status(http_status_code.ok).json({
         success: true,
         msg: "service deleted successfully" 
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
