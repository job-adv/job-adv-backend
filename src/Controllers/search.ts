import { Request, Response } from "express";
import http_status_code from "../constant/http_status_code";
import connect from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export default class Search {
  static async search(req: Request, res: Response) {
    const { text } = req.body;

    // Split the search text into parts and add type annotations
    const searchParts: string[] = text.split(' ').map((part: string) => part.trim()).filter((part: string) => part.length > 0);

    // Prepare the query parts for each search term
    const likeQuery: string[] = searchParts.map((part: string) => `%${part}%`);
    const fullTextQuery: string = searchParts.join(' ');

    console.log(searchParts);

    let status: number = http_status_code.serverError;
    try {
      const conn = await connect();

      let qr = `
        SELECT *
        FROM User
        WHERE role = 'professional'
          AND (
            ${searchParts.map(() => '(adress LIKE ? OR username LIKE ? OR firstname LIKE ? OR lastname LIKE ?)').join(' AND ')}
            OR MATCH(username, firstname, lastname) AGAINST(? IN BOOLEAN MODE)
          )
      `;
      let [artisan] = await conn.query<RowDataPacket[]>(qr, [...likeQuery.flatMap((part: string) => [part, part, part, part]), fullTextQuery]);

      qr = `
        SELECT *
        FROM User
        WHERE role = 'customer'
          AND (
            ${searchParts.map(() => '(adress LIKE ? OR username LIKE ? OR firstname LIKE ? OR lastname LIKE ?)').join(' AND ')}
            OR MATCH(username, firstname, lastname) AGAINST(? IN BOOLEAN MODE)
          )
      `;
      let [client] = await conn.query<RowDataPacket[]>(qr, [...likeQuery.flatMap((part: string) => [part, part, part, part]), fullTextQuery]);

      qr = `
        SELECT 
          Service.service_id, Service.title, Service.description, Service.status, Service.created_at, Service.subCategory_id, 
          User.user_id, User.username, User.firstname, User.lastname, User.email, User.adress AS address, User.phone_number, 
          User.instagram_link, User.facebook_link, User.tiktok_link, User.profile_picture, 
          Picture.picture_id, Picture.link AS picture_link, 
          Price.price_id, Price.value, Price.description AS price_description, Price.rate 
        FROM 
          Service 
        JOIN 
          User 
        ON 
          Service.user_id = User.user_id 
        LEFT JOIN 
          Picture 
        ON 
          Service.service_id = Picture.service_id 
        LEFT JOIN 
          Price 
        ON 
          Service.service_id = Price.service_id 
        WHERE 
          (MATCH(Service.title, Service.description) AGAINST(? IN BOOLEAN MODE))
          OR ${searchParts.map(() => 'Service.title LIKE ? OR Service.description LIKE ?').join(' OR ')}
          AND Service.service_id IS NOT NULL 
        GROUP BY 
          Service.service_id, Picture.picture_id, Price.price_id 
        ORDER BY 
          Service.created_at DESC
      `;
      const [serviceRows] = await conn.query<RowDataPacket[]>(qr, [fullTextQuery, ...likeQuery.flatMap((part: string) => [part, part])]);

      const serviceResult: any = {};
      serviceRows.forEach((row: any) => {
        if (!serviceResult[row.service_id]) {
          serviceResult[row.service_id] = {
            service_id: row.service_id,
            title: row.title,
            description: row.description,
            status: row.status,
            created_at: row.created_at,
            user_id: row.user_id,
            subcategory_id: row.subCategory_id,
            user: {
              user_id: row.user_id,
              username: row.username,
              firstname: row.firstname,
              lastname: row.lastname,
              email: row.email,
              adress: row.adress,
              phone_number: row.phone_number,
              instagram_link: row.instagram_link,
              facebook_link: row.facebook_link,
              tiktok_link: row.tiktok_link,
              profile_picture: row.profile_picture
            },
            pictures: [],
            prices: []
          };
        }

        const pictureExists = serviceResult[row.service_id].pictures.some((pic: any) => pic.picture_id === row.picture_id);
        if (row.picture_id && !pictureExists) {
          serviceResult[row.service_id].pictures.push({
            picture_id: row.picture_id,
            link: row.picture_link
          });
        }

        const priceExists = serviceResult[row.service_id].prices.some((pri: any) => pri.price_id === row.price_id);
        if (row.price_id && !priceExists) {
          serviceResult[row.service_id].prices.push({
            price_id: row.price_id,
            value: row.value,
            description: row.price_description,
            rate: row.rate
          });
        }
      });

      const finalServiceResult = Object.values(serviceResult);

      qr = `
        SELECT 
          Post.user_id, User.username, User.firstname, User.lastname, User.email, User.adress, User.phone_number, 
          User.instagram_link, User.facebook_link, User.tiktok_link, 
          User.profile_picture, Post.post_id, Post.title, Post.created_at AS post_created_at, 
          Post.description, Post.status 
        FROM 
          User, Post 
        WHERE 
          (MATCH(Post.title, Post.description) AGAINST(? IN BOOLEAN MODE))
          OR ${searchParts.map(() => 'Post.title LIKE ? OR Post.description LIKE ?').join(' OR ')}
          AND User.user_id = Post.user_id 
        ORDER BY 
          Post.created_at DESC
      `;
      let [post] = await conn.query<RowDataPacket[]>(qr, [fullTextQuery, ...likeQuery.flatMap((part: string) => [part, part])]);

      let [categories] = await conn.query<ResultSetHeader>("SELECT * FROM Category WHERE MATCH(category_name) AGAINST(? IN BOOLEAN MODE)", [fullTextQuery]);
      let [subCategories] = await conn.query<ResultSetHeader>("SELECT * FROM SubCategory WHERE MATCH(subCategory_name) AGAINST(? IN BOOLEAN MODE)", [fullTextQuery]);
      conn.release();

      const data = {
        artisans: artisan,
        clients: client,
        services: finalServiceResult,
        posts: post,
        categories: categories,
        subCategories: subCategories
      };

      console.log(data.posts);

      return res.status(http_status_code.ok).json({
        success: true,
        data: data
      });
    } catch (e) {
      return res.status(status).json({
        success: false,
        msg: e instanceof Error ? e.message : "An error occurred"
      });
    }
  }
}
