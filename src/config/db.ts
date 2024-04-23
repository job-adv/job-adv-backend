import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: "root",
  database: "hate_info",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

const getConnection = () => {
  return pool.getConnection();
};

export default getConnection;
