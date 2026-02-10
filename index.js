const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "shweta1494.be23@chitkarauniversity.edu.in"; 

const fibonacci = (n) => {
  if (n <= 0) return [];
  let a = 0, b = 1;
  let res = [];
  for (let i = 0; i < n; i++) {
    res.push(a);
    [a, b] = [b, a + b];
  }
  return res;
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));
const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL,
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const key = Object.keys(body)[0];

    if (!key) {
      return res.status(400).json({ is_success: false });
    }

    let data;

    if (key === "fibonacci") {
      data = fibonacci(body[key]);
    } else if (key === "prime") {
      data = body[key].filter(isPrime);
    } else if (key === "lcm") {
      data = lcm(body[key]);
    } else if (key === "hcf") {
      data = hcf(body[key]);
    } else if (key === "AI") {
      const ai = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ parts: [{ text: body[key] }] }],
        },
        { params: { key: process.env.GEMINI_API_KEY } }
      );
      data = ai.data.candidates[0].content.parts[0].text.split(" ")[0];
    } else {
      return res.status(400).json({ is_success: false });
    }

    res.json({
      is_success: true,
      official_email: EMAIL,
      data,
    });
  } catch {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
