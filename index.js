const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const os = require('os');
const si = require('systeminformation');
const morgan = require('morgan');

// Server Options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Ruta basica del servidor
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Rutas del servidor
const usersRouter = require("./routes/users");
const webHoouksRouter = require("./routes/webHooksRoutes");

// Rutas del servidor
app.use("/users", usersRouter);
app.use("/webhook", webHoouksRouter);

// Body parser
app.use(bodyparser.json());

// Funcion para obtener datos del sistema
async function cpuData() {
  const date = new Date();
  const hour = new Intl.DateTimeFormat('es', { hour: 'numeric', hour12: false }).format(date);
  const minute = new Intl.DateTimeFormat('es', { minute: 'numeric' }).format(date);
  const second = new Intl.DateTimeFormat('es', { second: 'numeric' }).format(date);

  const cpu = await si.cpu();
  const disk = await si.fsSize();
  const ram = await si.mem();
  const ip = Object.values(os.networkInterfaces())
    .flatMap(iface => iface.filter(address => !address.internal && address.family === 'IPv4'))
    .map(address => address.address);

  const status = {
    cpu,
    disk,
    ram,
    ip
  }

  console.log(`🟢  System Information: ${hour}:${minute}:${second}`);
  console.log(
    `🟢  IP status: ${status.ip} \n` +
    `🟢  Server time: ${hour}:${minute}:${second} \n` +
    `🟢  Server OS: ${os.platform()} \n` +
    `🟢  Server total CPU: ${os.cpus()[0].model} \n` +
    `🟢  Server total RAM: ${os.totalmem() / 1024 / 1024 / 1024} GB \n` +
    `🟢  Server total disk: ${status.disk[0].size} GB \n` +
    `🟢  Server RAM usage: ${status.ram.used / 1024 / 1024 / 1024} GB % \n` +
    `🟢  Server disk usage: ${status.disk[0].used} GB \n`
  );
}


// Puerto del servidor
const port = 3000;

// Inicia el servidor en el puerto especificado
async function startServer() {
  app.listen(port, () => {
    console.log(`🚀 API de webhook escuchando en el puerto ${port}` + "\n");
  });
}


async function main() {
  await cpuData();
  await startServer();
}

main();