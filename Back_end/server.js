import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// ⚠ replace this with actual Spoon SDK when installed
// this is pseudo API wiring style expected by spoon-core
import { SpoonClient } from "spoon-core";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const spoon = new SpoonClient({ apiKey: process.env.SPOON_API_KEY });

app.post("/chat", async (req, res) => {
  const { prompt, userId } = req.body;

  console.log("➡️ Agent received:", prompt);

  // 1. Tool call (Storage)
  try {
    await spoon.callTool("storage.put", {
      key: `${userId}/last_q`,
      value: prompt
    });
    console.log("✔ Tool storage.put executed");
  } catch (err) {
    console.log("⚠ Tool error ignored:", err.message);
  }

  // 2. Call LLM through Spoon
  try {
    const response = await spoon.llm.call({
      model: "openai/gpt-4o-mini",
      prompt: `Explain Web3 to a beginner: ${prompt}`
    });

    console.log("✔ LLM responded");
    res.json({ answer: response.text });

  } catch (err) {
    console.log("❌ LLM failed:", err.message);
    res.json({ answer: "Something went wrong — try again!" });
  }
});

app.listen(4000, () => console.log("Backend running on port 4000"));