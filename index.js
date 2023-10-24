const express = require("express");
const usersRouter = require("./routes/users");
const bodyparser = require("body-parser");
const app = express();
const port = 3000;

// Ruta basica del servidor
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Body parser
app.use(bodyparser.json());

// Ruta para recibir datos del webhook
app.post("/webhook", (req, res) => {
  const data = req.body;

  console.log(
    "Datos del webhook recibidos en formato json:",
    JSON.stringify(data, null, 2),
  );

  res.json({ mensaje: "Datos del webhook recibidos con éxito" });
});
// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`API de webhook escuchando en el puerto ${port}`);
});
