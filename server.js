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

  /*
    Discord-style webhooks usually send:
    {
      content: "Donation from USERNAME amount Rp10000 message hello"
      embeds: [...]
    }
  */

  let donorName = "Unknown";
  let amount = 0;
  let message = "";

  if (req.body.content) {
    const text = req.body.content;

    // VERY simple extraction (we can improve later)
    const amountMatch = text.match(/Rp[\s]?([\d\.]+)/);
    if (amountMatch) {
      amount = Number(amountMatch[1].replace(/\./g, ""));
    }

    const nameMatch = text.match(/from\s(.+?)\s/i);
    if (nameMatch) {
      donorName = nameMatch[1];
    }

    message = text;
  }

  donations.push({
    nama: donorName,
    amount: amount,
    message: message,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  });

  res.json({ success: true });
});

// ROBLOX FETCH
app.get("/api/sociabuzz/get-donations", (req, res) => {
  res.json({
    success: true,
    donations: donations
  });

  donations = [];
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
