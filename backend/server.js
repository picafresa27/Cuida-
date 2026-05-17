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

// ==========================================================================
// RUTA PARA REGISTRO DE PACIENTE POR PARTE DE LA RECEPCIONISTA (SOLO PERFIL)
// ==========================================================================
app.post("/registro-recepcion", async (req, res) => {
    // 1. CORREGIDO: Cambiado 'nombres' por 'nombre' para que coincida con tu frontend estándar
    const {
        nombre,
        apellidos,
        fechaNacimiento,
        genero,
        telefono,
        correo,
        password
    } = req.body;

    // Validación básica de los datos indispensables
    if (!nombre || !apellidos || !fechaNacimiento || !correo || !password) {
        return res.status(400).json({
            error: "Los campos Nombre, Apellidos, Fecha de Nacimiento, Correo y Password son obligatorios."
        });
    }

    try {
        const pool = await sql.connect(dbConfig);

        const correoLimpio = correo.trim().toLowerCase();

        // 2. VERIFICAR SI EL PACIENTE YA EXISTE (Fiel al modelo original)
        const usuarioExistente = await pool.request()
            .input('correo', sql.VarChar(100), correoLimpio)
            .query(`
                SELECT * FROM Paciente 
                WHERE LOWER(Correo) = @correo
            `);

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({
                error: "Ya existe una cuenta con este correo electrónico."
            });
        }

        // 3. INSERTAR ÚNICAMENTE EL NUEVO PACIENTE 
        // Se cambió sql.VarChar(10) por sql.Date para aceptar el formato YYYY-MM-DD
        const queryPaciente = await pool.request()
            .input('nombres', sql.VarChar(50), nombre)
            .input('apellidos', sql.VarChar(50), apellidos)
            .input('fecha', sql.Date, fechaNacimiento)
            .input('genero', sql.Char(1), genero)
            .input('tel', sql.VarChar(20), telefono || null)
            .input('correo', sql.VarChar(100), correoLimpio)
            .input('pass', sql.VarChar(255), password)
            .query(`
                INSERT INTO Paciente (Nombres, Apellidos, FechaNacimiento, Genero, Telefono, Correo, Password)
                OUTPUT INSERTED.IdPaciente
                VALUES (@nombres, @apellidos, @fecha, @genero, @tel, @correo, @pass)
            `);

        const nuevoIdPaciente = queryPaciente.recordset[0].IdPaciente;

        res.json({
            resultado: 1,
            mensaje: "Perfil de paciente creado con éxito en CuidaPlus.",
            idPaciente: nuevoIdPaciente,
            usuario: { nombre, correo: correoLimpio }
        });

    } catch (err) {
        console.error("Error en el registro de recepción:", err.message);
        res.status(500).json({
            resultado: 0,
            error: "No se pudo guardar el paciente en la base de datos: " + err.message
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
    console.log(req.body);
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

// RUTA PARA EL LOGIN DEL DOCTOR (NUEVO)
app.post("/loginDoctor", async (req, res) => {

    console.log(req.body);
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: "Por favor, ingresa correo y contraseña." });
    }

    try {
        const pool = await sql.connect(dbConfig);

        // Buscamos al doctor que coincida con ese correo y contraseña
        const result = await pool.request()
            .input('correo', sql.VarChar(100), correo)
            .input('pass', sql.VarChar(255), password)
            .query(`
                SELECT IdDoctor, Nombres, Apellidos, Correo 
                FROM Doctor 
                WHERE Correo = @correo AND Password = @pass
            `);

        if (result.recordset.length > 0) {
            const usuario = result.recordset[0];
            console.log(`Login exitoso: ${usuario.Nombres} (ID: ${usuario.IdDoctor})`);

            res.json({
                mensaje: "Inicio de sesión exitoso",
                usuario: {
                    id: usuario.IdDoctor,
                    nombres: usuario.Nombres,
                    apellidos: usuario.Apellidos,
                    correo: usuario.Correo
                    //fotoPerfil: usuario.FotoPerfil
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

app.post("/recuperarPassword", async (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ ok: false, error: "Por favor, ingresa tu correo electrónico." });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const correoLimpio = correo.trim().toLowerCase();

        // Buscamos si el correo existe en la base de datos
        const result = await pool.request()
            .input("correo", sql.VarChar(100), correoLimpio)
            .query(`
                SELECT IdPaciente, Nombres, Correo 
                FROM Paciente 
                WHERE Correo = @correo
            `);

        // Si no se encontró ningún registro
        if (result.recordset.length === 0) {
            return res.status(404).json({ ok: false, error: "El correo ingresado no está registrado." });
        }

        // Si sí existe, guardamos el usuario encontrado
        const usuario = result.recordset[0];
        console.log(`🟢 Correo confirmado para: ${usuario.Nombres}`);

        // Respondemos con un éxito rotundo (200 OK) y un JSON limpio
        return res.status(200).json({
            ok: true,
            mensaje: "Usuario encontrado con éxito.",
            idPaciente: usuario.IdPaciente
        });

    } catch (err) {
        console.error("Error en recuperarPassword:", err.message);
        return res.status(500).json({ ok: false, error: "Error interno en el servidor." });
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
        console.log("DATOS RECIBIDOS EN EL BACKEND:", req.body);
        const result = await pool.request()
        .input("fecha", sql.VarChar, fecha)
        .input("hora", sql.VarChar, hora)
        .input("estado", sql.VarChar(20), 'Pendiente')
        .input("anticipo", sql.Bit, anticipo ? 1 : 0)
        .input("idpaciente", sql.Int, idPaciente)
        .input("iddoctor", sql.Int, idDoctor)
        .input("numeroconsultorio", sql.VarChar(10), numeroConsultorio) // <-- Todo en minúsculas aquí
        .query(`
            INSERT INTO CitaMedica (Fecha, Hora, Estado, Anticipo, IdPaciente, IdDoctor, NumeroConsultorio) 
            VALUES (@fecha, @hora, @estado, @anticipo, @idpaciente, @iddoctor, @numeroconsultorio); -- <-- Y todo en minúsculas aquí

            SELECT SCOPE_IDENTITY() AS IdCita;
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
//RUTA PARA OBTENER CITAS DEL DOCTOR
app.get("/citas-doctor/:idDoctor/:fecha", async (req, res) => {

    const { idDoctor, fecha } = req.params;

    try {

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("idDoctor", sql.Int, idDoctor)
            .input("fecha", sql.Date, fecha)
            .query(`

                SELECT 
                    C.IdCita,

                    CONVERT(VARCHAR, C.Fecha, 23) AS Fecha,

                    LEFT(CONVERT(VARCHAR, C.Hora, 108), 5) AS Hora,

                    C.Estado,

                    CASE
                        WHEN CAST(C.Fecha AS DATE) < CAST(GETDATE() AS DATE)
                            THEN 'Pasada'

                        WHEN CAST(C.Fecha AS DATE) = CAST(GETDATE() AS DATE)
                            THEN 'Hoy'

                        ELSE 'Pendiente'
                    END AS TipoCita,

                    P.Nombres,
                    P.Apellidos,
                    P.Correo

                FROM CitaMedica C

                INNER JOIN Paciente P
                    ON C.IdPaciente = P.IdPaciente

                WHERE C.IdDoctor = @idDoctor
                AND CAST(C.Fecha AS DATE) = @fecha

                ORDER BY C.Fecha ASC, C.Hora ASC

            `);

        res.json(result.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo citas del doctor"
        });

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

app.get("/dashboard-doctor/:idDoctor", async (req, res) => {
    const { idDoctor } = req.params;

    try {
        const pool = await sql.connect(dbConfig);

        // 1. TOTAL CITAS HOY (Corregido con SWITCHOFFSET para evadir el horario UTC de Azure)
        const citasHoy = await pool.request()
            .input("idDoctor", sql.Int, idDoctor)
            .query(`
                SELECT COUNT(*) AS total
                FROM CitaMedica
                WHERE IdDoctor = @idDoctor
                AND CAST(Fecha AS DATE) = CAST(SWITCHOFFSET(SYSDATETIMEOFFSET(), '-06:00') AS DATE)
            `);

        // 2. TOTAL PACIENTES
        const pacientes = await pool.request()
            .input("idDoctor", sql.Int, idDoctor)
            .query(`
                SELECT COUNT(DISTINCT IdPaciente) AS total
                FROM CitaMedica
                WHERE IdDoctor = @idDoctor
            `);

        // 3. SIGUIENTE PACIENTE (Agregado IdCita, NumeroExpediente y fix de Zona Horaria)
        const siguientePaciente = await pool.request()
            .input("idDoctor", sql.Int, idDoctor)
            .query(`
                SELECT TOP 1
                    C.IdCita,                     -- 👈 ¡Indispensable para iniciar la consulta!
                    P.Nombres,
                    P.Apellidos,
                    CONVERT(VARCHAR, C.Fecha, 23) AS Fecha,
                    LEFT(CONVERT(VARCHAR, C.Hora, 108), 5) AS Hora,
                    C.NumeroConsultorio,
                    E.NumeroExpediente            -- 👈 ¡Para que funcione tu botón de Ver Expediente!
                FROM CitaMedica C
                INNER JOIN Paciente P 
                    ON C.IdPaciente = P.IdPaciente
                LEFT JOIN Expediente E            -- 👈 Unimos la tabla de expedientes
                    ON P.IdPaciente = E.IdPaciente
                WHERE C.IdDoctor = @idDoctor
                AND C.Estado = 'Pendiente'
                AND CAST(C.Fecha AS DATE) >= CAST(SWITCHOFFSET(SYSDATETIMEOFFSET(), '-06:00') AS DATE)
                ORDER BY C.Fecha ASC, C.Hora ASC
            `);

        res.json({
            citasHoy: citasHoy.recordset[0].total,
            pacientes: pacientes.recordset[0].total,
            siguientePaciente:
                siguientePaciente.recordset.length > 0
                    ? siguientePaciente.recordset[0]
                    : null
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error obteniendo dashboard del doctor"
        });
    }
});

app.get("/expediente/:idPaciente", async (req, res) => {

    const { idPaciente } = req.params;

    try {

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("idPaciente", sql.Int, idPaciente)
            .query(`
                SELECT
                    NumeroExpediente,
                    FechaApertura,
                    Antecedentes,
                    TipoSangre
                FROM Expediente
                WHERE IdPaciente = @idPaciente
            `);

        res.json(result.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo expediente"
        });
    }
});

app.get("/historial-paciente/:idPaciente/:idDoctor", async (req, res) => {

    const { idPaciente, idDoctor } = req.params;

    try {

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("idPaciente", sql.Int, idPaciente)
            .input("idDoctor", sql.Int, idDoctor)
            .query(`
                SELECT
                    IdCita,

                    CONVERT(VARCHAR, Fecha, 23) AS Fecha,

                    LEFT(CONVERT(VARCHAR, Hora, 108), 5) AS Hora,

                    Estado

                FROM CitaMedica

                WHERE IdPaciente = @idPaciente AND IdDoctor = @idDoctor

                ORDER BY Fecha DESC, Hora DESC
            `);

        res.json(result.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo historial"
        });
    }
});

app.get("/detalle-cita/:idCita", async (req, res) => {

    const { idCita } = req.params;

    try {

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("idCita", sql.Int, idCita)
            .query(`
                SELECT
                    Diagnostico,
                    Tratamiento,
                    Observaciones
                FROM ConsultaMedica
                WHERE IdCita = @idCita
            `);

        res.json(result.recordset[0] || {});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo detalle"
        });

    }

});

app.put("/cancelar-cita/:idCita", async (req, res) => {
    const { idCita } = req.params;

    try {
        const pool = await sql.connect(dbConfig);

        await pool.request()
            .input("idCita", sql.Int, idCita)
            .query(`
                UPDATE CitaMedica
                SET Estado = 'Cancelada'
                WHERE IdCita = @idCita
            `);

        // 🔥 AVISAR A TODOS LOS DISPOSITIVOS
        io.emit("cita-actualizada");

        // (opcional) evento más específico
        io.emit("cita-cancelada", { idCita });

        res.json({
            ok: true,
            mensaje: "Cita cancelada correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error cancelando la cita"
        });
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
    socket.on("cita-cancelada", () => {
        console.log("Cita cancelada. Avisando a todos...");
        socket.broadcast.emit("cita-actualizada");
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