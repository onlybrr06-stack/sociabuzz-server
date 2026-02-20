const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const SOCIABUZZ_SECRET = "PUT_YOUR_SECRET_HERE";

let donations = [];

app.post("/webhook", (req, res) => {
    const data = req.body;

    donations.push({
        nama: data.supporter_name,
        amount: Number(data.amount),
        message: data.message || "",
        timestamp: new Date().toISOString(),
        id: data.trx_id || Date.now().toString()
    });

    console.log("New donation:", data.supporter_name, data.amount);

    res.json({ success: true });
});

app.get("/get-donations", (req, res) => {
    res.json({
        success: true,
        donations: donations
    });

    donations = [];
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));