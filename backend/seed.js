require('dotenv').config();
const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function sembrarDatos() {
    try {
        console.log("🚀 Iniciando el sembrado de Cuida+...");
        let pool = await sql.connect(dbConfig);
        console.log("✅ Conexión establecida.");

        // 1. Sembrar Sucursal (Ocupamos SET IDENTITY_INSERT para forzar el ID 1)
        console.log("🏥 Sembrando Sucursales...");
        await pool.request().query(`
            SET IDENTITY_INSERT Sucursal ON;
            IF NOT EXISTS (SELECT * FROM Sucursal WHERE NumeroSucursal = 1)
            INSERT INTO Sucursal (NumeroSucursal, Direccion, Capacidad, Telefono, Horario) 
            VALUES (1, 'Av. Las Américas 123, Zona Norte', 50, '555-1234', '08:00-20:00');
            SET IDENTITY_INSERT Sucursal OFF;
        `);

        // 2. Sembrar Consultorio
        console.log("🏢 Sembrando Consultorios...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM Consultorio WHERE NumeroConsultorio = '4')
            INSERT INTO Consultorio (NumeroConsultorio, Estatus, Telefono, Disponibilidad, NumeroSucursal) 
            VALUES ('4', 'Activo', '555-0004', 'Disponible', 1);
        `);

        // 3. Sembrar Doctor
        console.log("👨‍⚕️ Sembrando Doctores...");
        await pool.request().query(`
            SET IDENTITY_INSERT Doctor ON;
            IF NOT EXISTS (SELECT * FROM Doctor WHERE IdDoctor = 1)
            INSERT INTO Doctor (IdDoctor, Nombres, Apellidos, Genero, Telefono, Correo, Especialidad, CedulaProfesional, Estatus, ModalidadRenta) 
            VALUES (1, 'Ana', 'Beltrán', 'M', '555-9876', 'ana.beltran@cuidaplus.com', 'Cardiología', 'CED-98765', 'Activo', 'Mensual');
            SET IDENTITY_INSERT Doctor OFF;
        `);

        // 4. Sembrar Tablas Puente (Asignar el Doctor a la Sucursal y Consultorio)
        console.log("🔗 Conectando Doctores con Consultorios...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM DoctorSucursal WHERE IdDoctor = 1 AND NumeroSucursal = 1)
            INSERT INTO DoctorSucursal (IdDoctor, NumeroSucursal) VALUES (1, 1);

            IF NOT EXISTS (SELECT * FROM DoctorConsultorio WHERE IdDoctor = 1 AND NumeroConsultorio = '4')
            INSERT INTO DoctorConsultorio (IdDoctor, NumeroConsultorio) VALUES (1, '4');
        `);

        // 5. Sembrar un Paciente de Prueba (Para que puedas agendar citas sin error)
        console.log("👤 Sembrando Paciente de prueba...");
        await pool.request().query(`
            SET IDENTITY_INSERT Paciente ON;
            IF NOT EXISTS (SELECT * FROM Paciente WHERE IdPaciente = 1)
            INSERT INTO Paciente (IdPaciente, Nombres, Apellidos, FechaNacimiento, Genero, Telefono, Correo, Password) 
            VALUES (1, 'Juan', 'Pérez', '1990-05-15', 'H', '555-1111', 'juan@test.com', '123456');
            SET IDENTITY_INSERT Paciente OFF;
        `);

        console.log("🌟 ¡PERFECTO! Catálogos sembrados exitosamente.");
        await sql.close();
    } catch (err) {
        console.error("❌ Error durante el sembrado:", err);
    }
}

sembrarDatos();