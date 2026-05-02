/*const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});*/

const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Simulación de base de datos
let usuarios = [];

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// 🔹 Crear usuario
app.post("/usuarios", (req, res) => {
  console.log("BODY RECIBIDO:", req.body);
  const { nombre, correo, telefono, edad, genero, password } = req.body;

  // Validaciones básicas
  if (!nombre || !correo || !password || !telefono || !edad || !genero) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios",
    });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    correo,
    telefono,
    edad,
    genero,
    password,
  };

  usuarios.push(nuevoUsuario);

  //console.log("USUARIOS DESPUÉS:", usuarios); // 👈 IMPORTANTE

  res.json({
    mensaje: "Usuario creado correctamente",
    usuario: nuevoUsuario,
  });
});

// 🔹 Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  console.log("USUARIOs:", usuarios); // 👈 agrega esto
  res.json(usuarios);
});

// 🔹 Obtener usuario por ID (extra útil)
app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(usuario);
});

// 🔹 Eliminar usuario (opcional)
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

  usuarios = usuarios.filter((u) => u.id !== id);

  res.json({ mensaje: "Usuario eliminado" });
});

// 🔹 Puerto
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
