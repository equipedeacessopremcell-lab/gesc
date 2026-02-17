const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/cnpj/:cnpj", async (req, res) => {
  const { cnpj } = req.params;

  try {
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);

    if (!response.ok) {
      return res.status(response.status).json({ erro: "CNPJ não encontrado" });
    }

    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar CNPJ" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});