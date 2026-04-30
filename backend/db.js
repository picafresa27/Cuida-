const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function conectar() {
  try {
    return await sql.connect(config);
  } catch (err) {
    console.log("Error conexión:", err);
  }
}

module.exports = { conectar, sql };