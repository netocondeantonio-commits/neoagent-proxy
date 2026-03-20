const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

// Permite chamadas de qualquer origem (seu app Claude.ai)
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ status: "NeoAgent Proxy ativo ✅" }));

// Proxy para Infosimples — Download simples
app.get("/neoenergia/download", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.infosimples.com/api/v2/consultas/contas/neoenergia/download",
      { params: req.query }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      detail: err.response?.data || null,
    });
  }
});

// Proxy para Infosimples — Download + OCR (recomendado)
app.get("/neoenergia/download-ocr", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.infosimples.com/api/v2/consultas/contas/neoenergia/download-ocr",
      { params: req.query }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      detail: err.response?.data || null,
    });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
