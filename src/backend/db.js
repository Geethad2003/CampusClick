const mysql = require("mysql2");

// Create the MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",            
  password: "geetha2446",  
  database: "campusclick", 
  waitForConnections: true,
  connectionLimit: 10,   
  queueLimit: 0,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); 
  } else {
    console.log("Database connected!");
    connection.release();  
  }
});

module.exports = db;
