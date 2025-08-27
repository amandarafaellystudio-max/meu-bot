const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Rota principal só para teste
app.get("/", (req, res) => {
  res.send("🚀 Bot rodando no Render com sucesso!");
});

// Mantém o servidor ativo
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
