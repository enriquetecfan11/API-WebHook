const express = require("express");
const usersRouter = require("./routes/users");
const bodyparser = require("body-parser");
const app = express();
const si = require('systeminformation');


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

// Funcion para obtener datos del sistema
async function cpuData() {
  try {
    const data = await si.cpu();
    // si.networkGatewayDefault().then(data => console.log(data));
    const networkData = await si.networkInterfaces();
    console.log('💻 CPU Information:' + data.brand + ' Cores ' + data.cores + ' Pysical Cores ' + data.physicalCores  + "\n");
    console.log('🛜 ' + networkData[1].iface + ' IP: ' + networkData[1].ip4  + "\n");
  } catch (e) {
    console.log(e)
  }
}


// Puerto del servidor
const port = 3000;

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  cpuData();
  console.log(`🚀 API de webhook escuchando en el puerto ${port}` + "\n");
});
