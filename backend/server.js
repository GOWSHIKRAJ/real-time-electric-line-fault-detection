const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// ======================
// BASIC SERVER SETUP
// ======================
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ======================
// AUTO-DETECT ESP32 PORT
// ======================
async function startSerial() {
  const ports = await SerialPort.list();

  // ESP32 usually shows as USB / CP210 / CH340
  const espPort = ports.find(
    (p) =>
      p.manufacturer?.includes("Silicon") ||
      p.manufacturer?.includes("CP210") ||
      p.manufacturer?.includes("CH340") ||
      p.path.includes("COM")
  );

  if (!espPort) {
    console.error("❌ ESP32 not found. Plug device.");
    process.exit(1);
  }

  console.log(`🔌 ESP32 detected on ${espPort.path}`);

  const port = new SerialPort({
    path: espPort.path,
    baudRate: 115200,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  let lastSystemStatus = {
    systemStatus: "NORMAL",
    message: "System running normally",
    updatedAt: new Date().toISOString(),
  };

  parser.on("data", (data) => {
    const msg = data.trim();
    console.log("ESP32:", msg);

    if (msg === "FAULT" && lastSystemStatus.systemStatus !== "ALERT") {
      lastSystemStatus = {
        systemStatus: "ALERT",
        message: "⚠️ Power cut / wire fallen detected",
        updatedAt: new Date().toISOString(),
      };
      io.emit("power-status", lastSystemStatus);
    }

    if (msg === "NORMAL" && lastSystemStatus.systemStatus !== "NORMAL") {
      lastSystemStatus = {
        systemStatus: "NORMAL",
        message: "✅ Power restored",
        updatedAt: new Date().toISOString(),
      };
      io.emit("power-status", lastSystemStatus);
    }
  });

  port.on("error", (err) => {
    console.error("❌ Serial error:", err.message);
  });

  return lastSystemStatus;
}

// ======================
// SOCKET.IO
// ======================
let cachedStatus = null;

io.on("connection", (socket) => {
  console.log("🌐 Frontend connected:", socket.id);
  if (cachedStatus) socket.emit("power-status", cachedStatus);
});

// ======================
// START SERVER
// ======================
const PORT = 5000;

server.listen(PORT, async () => {
  console.log("=================================");
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("=================================");
  cachedStatus = await startSerial();
});
