require('dotenv').config(); //Carga las variables desde el archivo .env
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Configuración de Conexión a Azure SQL
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true, //Requerido para Azure SQL
        trustServerCertificate: false
    }
};

//Conexión Inicial
const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Conectado exitosamente a Azure SQL (CuidaPlus) 🚀");
    } catch (err) {
        console.error("Error al conectar con la base de datos:", err);
    }
};

connectDB();

// --- RUTAS API ---
app.get("/", (req, res) => {
    res.send("Backend de CuidaPlus funcionando en la nube 🚀");
});

//Crear un nuevo Paciente
app.post("/usuarios", async (req, res) => {
    const { nombre, apellidos, fechaNacimiento, genero, telefono, correo, password } = req.body;
    if (!nombre || !apellidos || !fechaNacimiento || !correo || !password) {
        return res.status(400).json({ 
            error: "Los campos Nombre, Apellidos, Fecha de Nacimiento, Correo y Password son obligatorios." 
        });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombres', sql.VarChar(50), nombre)
            .input('apellidos', sql.VarChar(50), apellidos)
            .input('fecha', sql.Date, fechaNacimiento)
            .input('genero', sql.Char(1), genero)
            .input('tel', sql.VarChar(20), telefono)
            .input('correo', sql.VarChar(100), correo)
            .input('pass', sql.VarChar(255), password)
            .query(`INSERT INTO Paciente (Nombres, Apellidos, FechaNacimiento, Genero, Telefono, Correo, Password) 
                    VALUES (@nombres, @apellidos, @fecha, @genero, @tel, @correo, @pass)`);

        res.json({ 
            mensaje: "Paciente registrado correctamente en CuidaPlus",
            usuario: { nombre, correo }
        });
    } catch (err) {
        console.error("Error en INSERT:", err);
        res.status(500).json({ error: "No se pudo guardar el paciente en la base de datos." });
    }
});

// Obtener lista de todos los Pacientes 
app.get("/usuarios", async (req, res) => {
     try {
         const pool = await sql.connect(dbConfig);
         // Usamos "AS" para que los nombres coincidan con tu frontend
        const result = await pool.request().query(`
        SELECT 
            IdPaciente, 
            Nombres AS nombre, 
            Correo AS correo, 
            Password AS password 
        FROM Paciente
    `);
         res.json(result.recordset);
     } catch (err) {
         console.error("Error en SELECT:", err);
        res.status(500).json({ error: "Error al obtener la lista de pacientes." });
    }
});

//Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de CuidaPlus corriendo en http://localhost:${PORT}`);
  });