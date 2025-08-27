const express = require("express");
const app = express();
app.use(express.json());

// ✅ Rota para verificação do Webhook (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "meu_token_123"; // o mesmo token que você colocou no Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado com sucesso!");
    res.status(200).send(challenge); // envia o desafio de volta ao Meta
  } else {
    res.sendStatus(403); // se o token não bate
  }
});

// ✅ Rota para receber mensagens do WhatsApp (POST)
app.post("/webhook", (req, res) => {
  console.log("Mensagem recebida do WhatsApp:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ✅ Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
