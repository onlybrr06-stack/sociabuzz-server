app.post("/api/bagibagi/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  try {
    let donorName = "Seseorang";
    let amount = 0;
    let message = "";

    const embed = req.body.embeds && req.body.embeds[0];  // Take the first embed from the array

    if (embed) {
      // ✅ Extract donor name from the embed title
      if (embed.title) {
        donorName = embed.title.trim();
      }

      // ✅ Extract donation amount from fields
      const amountField = embed.fields && embed.fields.find(field => field.name === "Amount");
      if (amountField && amountField.value) {
        const amountMatch = amountField.value.match(/([\d,.]+)\s*Koin/i);
        if (amountMatch) {
          amount = Number(amountMatch[1].replace(/[,.]/g, ""));
        }
      }

      // ✅ Extract message from description (if any)
      if (embed.description) {
        const messageMatch = embed.description.match(/'\*\*Pesan\*\*'.*?`([^`]+)`/i);
        if (messageMatch) {
          message = messageMatch[1];
        }
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


