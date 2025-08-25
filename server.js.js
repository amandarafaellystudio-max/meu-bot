const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

// 🔑 Pega as variáveis de ambiente do Render
const token = process.env.WHATSAPP_TOKEN;       // Token de acesso do Meta
const phoneNumberId = process.env.PHONE_NUMBER_ID; // ID do número de telefone
const verifyToken = process.env.VERIFY_TOKEN;  // Token de verificação inventado por você

// Carrega o fluxo criado no BotPlugin
const flow = JSON.parse(fs.readFileSync("bot.json", "utf-8"));

const app = express();
app.use(bodyParser.json());

// ✅ Verificação do Webhook (Meta chama isso ao configurar)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("Webhook verificado com sucesso!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Receber mensagens do WhatsApp
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry[0].changes[0].value.messages[0];
    const from = message.from; // Número do cliente
    const text = message.text.body.toLowerCase();

    // Usa seu fluxo do bot.json
    let resposta = "Desculpe, não entendi 🤖";
    if (flow[text]) {
      resposta = flow[text];
    }

    // Envia a resposta pelo WhatsApp API
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: resposta },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// ✅ Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor rodando na porta " + PORT));
