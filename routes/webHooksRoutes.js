const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


// Si la carpeta data no existe creala y crea dentro un archivo JSON con el nomnbre webhook-data
const dataDir = "./data";
const dataFilePath = `${dataDir}/webhook-data.json`;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  fs.writeFileSync(dataFilePath, "[]");
}



// Ruta para recibir datos del webhook
router.post("/", (req, res) => {
  const data = req.body;

  // Genera un ID único para este conjunto de datos
  const uniqueId = uuidv4();
  data.id = uniqueId;

  // Leer el archivo JSON existente
  fs.readFile(dataFilePath, (err, existingData) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      return res
        .status(500)
        .json({ error: "No se pudieron guardar los datos" });
    }

    // Parsear el contenido existente del archivo JSON (si existe)
    const parsedData = existingData.length > 0 ? JSON.parse(existingData) : [];

    // Agregar los nuevos datos al arreglo existente
    parsedData.push(data);

    // Escribir el arreglo actualizado en el archivo JSON
    fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo JSON:", err);
        return res
          .status(500)
          .json({ error: "No se pudieron guardar los datos" });
      }

      res.json({
        mensaje: "Datos del webhook recibidos y guardados con éxito",
      });
    });
  });
});

// Ruta para obtener los datos almacenados
router.get("/", (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      return res
        .status(500)
        .json({ error: "No se pudieron obtener los datos" });
    }

    const parsedData = JSON.parse(data);
    res.json(parsedData);
  });
});

module.exports = router;
