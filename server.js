const express = require("express");

const app = express();
app.use(express.json());

let donations = [];

// TEST ROUTE (so homepage doesn't show error)
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is live" });
});

// WEBHOOK (Sociabuzz will send donations here)
app.post("/api/sociabuzz/webhook", (req, res) => {
  const data = req.body;

  donations.push({
    nama: data.supporter_name || "Unknown",
    amount: Number(data.amount) || 0,
    message: data.message || "",
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  });

  console.log("New donation:", data.supporter_name, data.amount);

  res.json({ success: true });
});

// ROBLOX WILL CHECK THIS
app.get("/api/sociabuzz/get-donations", (req, res) => {
  res.json({
    success: true,
    donations: donations
  });

  donations = [];
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
