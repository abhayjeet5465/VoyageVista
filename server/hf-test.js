import "dotenv/config";
import axios from "axios";

console.log("TOKEN_FROM_ENV =", process.env.HF_TOKEN);

axios.post(
  "https://router.huggingface.co/v1/chat/completions",
  {
    model: "meta-llama/Llama-3.2-1B-Instruct:novita",
    messages: [
      { role: "user", content: "Hello" }
    ]
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
  }
).then(r => console.log("SUCCESS:", r.data))
 .catch(e => console.log("HF ERROR:", e.response?.data));
