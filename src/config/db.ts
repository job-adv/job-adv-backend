import mysql from "mysql2/promise";

const connect = async (): Promise<mysql.Connection>=> {
  return await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE
  });
} 


export default connect;