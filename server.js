const express = require("express");

const app = express();
app.use(express.json());

let donations = [];

// Home test
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is live" });
});

// BAGIBAGI DISCORD WEBHOOK RECEIVER
app.post("/api/bagibagi/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  try {
    let donorName = "Seseorang";
    let amount = 0;
    let message = "";

    const embedText = req.body.embeds;

    if (embedText && typeof embedText === "string") {

      // ✅ Extract amount
      const amountMatch = embedText.match(/([\d,.]+)\s*Koin/i);
      if (amountMatch) {
        amount = Number(amountMatch[1].replace(/[,.]/g, ""));
      }

      // ✅ Extract message
      const messageMatch = embedText.match(/'\*\*Pesan\*\*'.*?`([^`]+)`/i);
      if (messageMatch) {
        message = messageMatch[1];
      }

      // ✅ Extract donor name if exists
      const nameMatch = embedText.match(/title:\s*(.*?)\s*mengirim/i);
      if (nameMatch) {
        donorName = nameMatch[1].trim();
      }
    }

    donations.push({
      nama: donorName,
      amount: amount,
      message: message,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });

    console.log("Parsed donation:", donorName, amount, message);

    res.json({ success: true });

  } catch (err) {
    console.log("Parsing error:", err);
    res.json({ success: false });
  }
});


