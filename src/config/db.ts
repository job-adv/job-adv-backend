import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: "root",
  database: "hate_info",
 
});

/*const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'profinder',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 75,
  queueLimit: 0
});*/
/*
const pool = mysql.createPool({
  host: 'profinder-backend1.a.aivencloud.com',
  user: 'avnadmin',
  database: 'defaultdb',
  password: 'AVNS_-QzMypn1LwtayxK7T5X',
  port: 13141,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/

const getConnection = () => {
  return pool.getConnection();
};

export default getConnection;
