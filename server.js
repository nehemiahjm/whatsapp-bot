require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

/*
==================================
  WEBHOOK VERIFICATION (META)
==================================
*/

app.get("/webhook", (req, res) => {
  const verify_token = "hisabi_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("Webhook verified ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

/*
==================================
  ROOT ROUTE
==================================
*/

app.get("/", (req, res) => {
  res.send("Hisabi Cloud API Running 🚀");
});

/*
==================================
  RECEIVE MESSAGES
==================================
*/

app.post("/webhook", (req, res) => {
  console.log("Incoming Webhook:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});