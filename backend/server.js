require('dotenv').config(); //Carga las variables desde el archivo .env
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

// 1. IMPORTACIONES PARA SOCKET.IO
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// 2. CREACIÓN DEL SERVIDOR HTTP Y SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permite que cualquier celular de Expo se conecte
    }
});

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

        const correoLimpio = correo.trim().toLowerCase();

        // 🔍 VERIFICAR SI EL CORREO YA EXISTE
        const usuarioExistente = await pool.request()
            .input('correo', sql.VarChar(100), correoLimpio)
            .query(`
                SELECT * 
                FROM Paciente 
                WHERE LOWER(Correo) = @correo
            `);

        // Si encontró registros
        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({
                error: "Ya existe una cuenta con este correo electrónico."
            });
        }

        // ✅ INSERTAR NUEVO USUARIO
        await pool.request()
            .input('nombres', sql.VarChar(50), nombre)
            .input('apellidos', sql.VarChar(50), apellidos)
            .input('fecha', sql.Date, fechaNacimiento)
            .input('genero', sql.Char(1), genero)
            .input('tel', sql.VarChar(20), telefono)
            .input('correo', sql.VarChar(100), correo)
            .input('pass', sql.VarChar(255), password)
            .query(`
                INSERT INTO Paciente
                (Nombres, Apellidos, FechaNacimiento, Genero, Telefono, Correo, Password)
                VALUES
                (@nombres, @apellidos, @fecha, @genero, @tel, @correo, @pass)
            `);

        res.json({
            mensaje: "Paciente registrado correctamente en CuidaPlus",
            usuario: { nombre, correo }
        });

    } catch (err) {
        console.error("Error en INSERT:", err);

        res.status(500).json({
            error: "No se pudo guardar el paciente en la base de datos."
        });
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

// Obtener lista de todos los Doctores
app.get("/doctores", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                IdDoctor AS idDoctor,
                Nombres AS nombre,
                Apellidos AS apellidos,
                Genero AS genero,
                Telefono AS telefono,
                Correo AS correo,
                Especialidad AS especialidad,
                CedulaProfesional AS cedulaProfesional,
                Estatus AS estatus,
                ModalidadRenta AS modalidadRenta
            FROM Doctor
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("Error en SELECT DOCTORES:", err);

        res.status(500).json({
            error: "Error al obtener la lista de doctores."
        });
    }
});

// 3. LÓGICA DE EVENTOS DE SOCKET.IO
io.on("connection", (socket) => {
    console.log("⚡ Un celular se acaba de conectar a Cuida+ con ID:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Un celular se desconectó");
    });
});

// 4. ARRANCAR EL SERVIDOR USANDO "server.listen" (NO app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de CuidaPlus corriendo con Sockets en el puerto ${PORT} 🚀`);
});