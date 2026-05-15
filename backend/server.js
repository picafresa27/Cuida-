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
app.post("/registro", async (req, res) => {
    const { nombre, apellidos, fechaNacimiento, genero, telefono, correo, password } = req.body;

    if (!nombre || !apellidos || !fechaNacimiento || !correo || !password) {
        return res.status(400).json({
            error: "Los campos Nombre, Apellidos, Fecha de Nacimiento, Correo y Password son obligatorios."
        });
    }

    try {
        const pool = await sql.connect(dbConfig);

        const correoLimpio = correo.trim().toLowerCase();

        // VERIFICAR SI EL CORREO YA EXISTE
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

        // INSERTAR NUEVO USUARIO
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
            Apellidos AS apellido,
            Correo AS correo,
            FotoPerfil AS fotoPerfil, 
            Password AS password 
        FROM Paciente
    `);
         res.json(result.recordset);
     } catch (err) {
         console.error("Error en SELECT:", err);
        res.status(500).json({ error: "Error al obtener la lista de pacientes." });
    }
});

// ==========================================
// RUTA PARA OBTENER LOS DOCTORES (NUEVO)
// ==========================================
app.get("/doctores", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT IdDoctor, Nombres, Apellidos, Especialidad FROM Doctor WHERE Estatus = 'Activo'");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener doctores:", err);
        res.status(500).json({ error: "No pude traer a los doctores de la base de datos" });
    }
});

// RUTA PARA EL LOGIN DEL PACIENTE (NUEVO)
app.post("/login", async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: "Por favor, ingresa correo y contraseña." });
    }

    try {
        const pool = await sql.connect(dbConfig);
        
        // Buscamos al paciente que coincida con ese correo y contraseña
        const result = await pool.request()
            .input('correo', sql.VarChar(100), correo)
            .input('pass', sql.VarChar(255), password)
            .query(`
                SELECT IdPaciente, Nombres, Apellidos, Correo, FotoPerfil 
                FROM Paciente 
                WHERE Correo = @correo AND Password = @pass
            `);

        if (result.recordset.length > 0) {
            const usuario = result.recordset[0];
            console.log(`Login exitoso: ${usuario.Nombres} (ID: ${usuario.IdPaciente})`);
            
            res.json({ 
                mensaje: "Inicio de sesión exitoso", 
                usuario: {
                    id: usuario.IdPaciente,
                    nombres: usuario.Nombres,
                    apellidos: usuario.Apellidos,
                    correo: usuario.Correo,
                    fotoPerfil: usuario.FotoPerfil
                }
            });
        } else {
            console.log(`Intento de login fallido para: ${correo}`);
            res.status(401).json({ error: "Correo o contraseña incorrectos." });
        }
    } catch (err) {
        console.error("Error en el login:", err);
        res.status(500).json({ error: "Error en el servidor al intentar iniciar sesión." });
    }
});

// RUTA PARA LA FOTO DE PERFIL DEL PACIENTE (NUEVO)
app.post("/actualizarFotoPerfil", async (req, res) => {
    console.log(req.body);
  const { idPaciente, fotoPerfil } = req.body;

  try {

    console.log("Actualizando foto...");

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("idPaciente", sql.Int, idPaciente)
      .input("fotoPerfil", sql.VarChar, fotoPerfil)
      .query(`
        UPDATE Paciente
        SET FotoPerfil = @fotoPerfil
        WHERE IdPaciente = @idPaciente
      `);

      console.log("Foto actualizada");

    res.json({
      ok: true,
      mensaje: "Foto actualizada"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error actualizando foto"
    });
  }
});

// RUTA PARA AGENDAR UNA CITA 
app.post("/agendarCita", async (req, res) => {
    const { fecha, hora, idPaciente, idDoctor, numeroConsultorio, anticipo } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        const checkPaciente = await pool.request()
            .input("fecha", sql.VarChar, fecha)
            .input("hora", sql.VarChar, hora)
            .input("idPaciente", sql.Int, idPaciente)
            .query(`
                SELECT COUNT(*) as total 
                FROM CitaMedica 
                WHERE Fecha = @fecha 
                  AND Hora = @hora 
                  AND IdPaciente = @idPaciente 
                  AND Estado != 'Cancelada'
            `);

        if (checkPaciente.recordset[0].total > 0) {
            return res.status(409).json({ 
                error: "Ya tienes otra cita agendada exactamente a esta misma hora." 
            });
        }

        const checkDoctor = await pool.request()
            .input("fecha", sql.VarChar, fecha)
            .input("hora", sql.VarChar, hora)
            .input("idDoctor", sql.Int, idDoctor)
            .query(`
                SELECT COUNT(*) as total 
                FROM CitaMedica 
                WHERE Fecha = @fecha 
                  AND Hora = @hora 
                  AND IdDoctor = @idDoctor 
                  AND Estado != 'Cancelada'
            `);

        if (checkDoctor.recordset[0].total > 0) {
            return res.status(409).json({ 
                error: "El doctor se acaba de ocupar en este horario. Por favor elige otro." 
            });
        }
        
        const result = await pool.request()
            .input("fecha", sql.VarChar, fecha) 
            .input("hora", sql.VarChar, hora)   
            .input("idPaciente", sql.Int, idPaciente)
            .input("idDoctor", sql.Int, idDoctor)
            .input("numConsultorio", sql.VarChar(10), numeroConsultorio)
            .input("anticipo", sql.Bit, anticipo ? 1 : 0)
            .input("estado", sql.VarChar(20), 'Pendiente') 
            .query(`
                INSERT INTO CitaMedica (Fecha, Hora, IdPaciente, IdDoctor, NumeroConsultorio, Anticipo, Estado)
                OUTPUT INSERTED.IdCita
                VALUES (@fecha, @hora, @idPaciente, @idDoctor, @numConsultorio, @anticipo, @estado)
            `);

        const nuevoIdCita = result.recordset[0].IdCita;
        console.log(`Cita agendada con éxito. ID: ${nuevoIdCita}`);

        if (io) {
            io.emit('cita-actualizada'); 
        }

        res.status(201).json({ 
            mensaje: "Cita creada correctamente", 
            idCita: nuevoIdCita 
        });

    } catch (err) {
        // Esto te ayudará a ver cualquier otro error de columna en la terminal
        console.error("Error en SQL:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// RUTA PARA OBTENER HORARIOS OCUPADOS DE UN DOCTOR EN UNA FECHA
app.get("/horarios-ocupados/:idDoctor/:fecha", async (req, res) => {
    const { idDoctor, fecha } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("idDoctor", sql.Int, idDoctor)
            .input("fecha", sql.VarChar, fecha)
            .query(`
                SELECT Hora 
                FROM CitaMedica 
                WHERE IdDoctor = @idDoctor 
                  AND Fecha = @fecha 
                  AND Estado != 'Cancelada'
            `);

        // Convertimos el formato de SQL a un array simple: ["09:00", "10:30"]
        const ocupados = result.recordset.map(row => {
            // SQL suele devolver la hora con segundos (10:30:00), limpiamos a HH:mm
            const h = row.Hora;
            return typeof h === 'string' ? h.substring(0, 5) : h.toISOString().substring(11, 16);
        });

        res.json(ocupados);
    } catch (err) {
        console.error("Error al obtener ocupados:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Obtener las citas de un paciente específico
// Obtener las citas de un paciente específico (CORREGIDA PARA FORMATO DE FECHA)
app.get("/mis-citas/:idPaciente", async (req, res) => {
    const { idPaciente } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("idPaciente", sql.Int, idPaciente)
            .query(`
                SELECT 
                    C.IdCita, 
                    CONVERT(VARCHAR, C.Fecha, 126) AS fechaRaw, 
                    CONVERT(VARCHAR, C.Hora, 108) AS horaRaw, 
                    C.Estado, 
                    D.Nombres AS nombreDoctor, 
                    D.Apellidos AS apellidosDoctor, 
                    D.Especialidad
                FROM CitaMedica C
                LEFT JOIN Doctor D ON C.IdDoctor = D.IdDoctor
                WHERE C.IdPaciente = @idPaciente
            `)

        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener citas:", err);
        res.status(500).json({ error: "Error al obtener las citas del servidor" });
    }
});

// Ruta para registrar un nuevo pago (Anticipo o Liquidación)
app.post("/pagos", async (req, res) => {
  const { monto, metodoPago, estatus, tipoPago, idCita } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("monto", sql.Money, monto)
      .input("metodoPago", sql.VarChar, metodoPago)
      .input("estatus", sql.VarChar, estatus)
      .input("tipoPago", sql.VarChar, tipoPago)
      .input("idCita", sql.Int, idCita)
      .query(`
        INSERT INTO Pagos (Fecha, Monto, MetodoPago, Estatus, TipoPago, IdCita)
        VALUES (GETDATE(), @monto, @metodoPago, @estatus, @tipoPago, @idCita)
      `);

    res.status(201).json({ message: "Pago registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar pago:", err);
    res.status(500).json({ error: "No se pudo registrar el pago en la base de datos" });
  }
});

// 3. LÓGICA DE EVENTOS DE SOCKET.IO
io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado al socket:", socket.id);

    socket.on('nueva-cita', () => {
        console.log("Alguien agendó. Avisando a todos los demás dispositivos...");
        // broadcast.emit le envía el mensaje a TODOS menos al que lo mandó
        socket.broadcast.emit('cita-actualizada'); 
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});

// 4. ARRANCAR EL SERVIDOR USANDO "server.listen" (NO app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de CuidaPlus corriendo con Sockets en el puerto ${PORT} 🚀`);
});

app.put("/actualizar-perfil/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, telefono, correo, password } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.VarChar, nombre)
            .input("apellidos", sql.VarChar, apellidos)
            .input("telefono", sql.VarChar, telefono)
            .input("correo", sql.VarChar, correo)
            .input("password", sql.VarChar, password)
            .query(`
                UPDATE Paciente 
                SET Nombres = @nombre, 
                    Apellidos = @apellidos, 
                    Telefono = @telefono,
                    Correo = @correo,
                    Password = ISNULL(NULLIF(@password, ''), Password)
                WHERE IdPaciente = @id
            `);

        res.json({ mensaje: "Perfil actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/proxima-cita/:idPaciente", async (req, res) => {
    const { idPaciente } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("idPaciente", sql.Int, idPaciente)
            .query(`
                SELECT TOP 1 
                    c.IdCita, 
                    c.Fecha, 
                    c.Hora, 
                    d.Nombres AS NombreMedico, 
                    d.Apellidos AS ApellidoMedico,
                    d.Especialidad 
                FROM CitaMedica c
                LEFT JOIN Doctor d ON c.IdDoctor = d.IdDoctor
                WHERE c.IdPaciente = @idPaciente 
                AND CAST(c.Fecha AS DATE) >= CAST(GETDATE() AS DATE)
                ORDER BY c.Fecha ASC, c.Hora ASC
            `);

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json(null); // Si la cita más cercana ya pasó, enviamos null
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al buscar la próxima cita" });
    }
});