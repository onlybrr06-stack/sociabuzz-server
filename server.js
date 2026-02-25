app.post("/api/bagibagi/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  let donorName = "Unknown";
  let amount = 0;
  let message = "";

  try {
    if (req.body.embeds) {
      // Convert string to JSON safely
      const embeds = JSON.parse(req.body.embeds.replace(/'/g, '"'));

      const embed = embeds[0];

      // Extract amount from title
      const title = embed.title || "";
      const amountMatch = title.match(/([\d,]+)\s*Koin/);
      if (amountMatch) {
        amount = Number(amountMatch[1].replace(/,/g, ""));
      }

      // Extract message from fields
      if (embed.fields) {
        const pesanField = embed.fields.find(f =>
          f.name.includes("Pesan")
        );

        if (pesanField) {
          message = pesanField.value.replace(/`/g, "");
        }
      }

      // If donor types username like:
      // NeonClub | Hello bro
      if (message.includes("|")) {
        const parts = message.split("|");
        donorName = parts[0].trim();
        message = parts[1].trim();
      }
    }

    donations.push({
      nama: donorName,
      amount: amount,
      message: message,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });

    res.json({ success: true });

  } catch (err) {
    console.log("Parsing error:", err);
    res.json({ success: false });
  }
});
