import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://compliment-client.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET"],
}));

app.use(express.json());

// Short tap lines only (unlock letter lives in the frontend)
const compliments = [
  "I",
  "Love",
  "You",
  "Mahal",
  "Kita",
  "Te",
  "Amo",
  "Je",
  "T'aime",
];

let pool = [...compliments];
function drawOne() {
  if (pool.length === 0) pool = [...compliments];
  const idx = Math.floor(Math.random() * pool.length);
  const picked = pool[idx];
  pool.splice(idx, 1);
  return picked;
}

app.get("/api/compliment", (req, res) => {
  res.json({ text: drawOne() });
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
