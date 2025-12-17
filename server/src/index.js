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

const compliments = [
  "I love your smile",
  "I love how you make conversations feel so easy",
  "I love how time moves so fast around you.",
  "I love how family oriented you are ",
  "I love how funny you are",
  "I love how fun you can be",
  "I love your pretty eyes",
  "I love your relationship with God",
  "I love how we can talk about anything",
  "I love how comfortable I am around you and how safe you make me feel",
  "I love how hard working you are",
  "I love how caring you can be",
  "I love how your independant and work for yourself",
  "I love the gifts you give, and how sweet you can be",
  "I love spending time with you and just you",
  "I love how your mine <3",
  "I love being a big back with you",
  "I love how your not afraid to experience new things",
  "I love how you can fit in with me and my friends",
  "I love how you can fit into my future",
  "Being around you just feels right",
  "You have one of those laughs that sticks, I love it",
  "You’re lowkey my favorite notification",
  "You make the room feel lighter",
  "Your sooooo pretty, like thats my ball????",
  "I love the way you see things",
  "You’re lowkey unforgettable",
  "You make people smile without trying",
  "You’ve got a really comforting presence",
  "You make ordinary days better",
  "You’re dangerously easy to like",
  "You just get it",
  "I love how dumb your humor is like 67 bruh",
  "You make things feel natural",
  "Hi baby, you found the hidden paragraph. I just wanna say you are my favourite person in my life right now. I am honestly so grateful that I met you and I thank God everyday for bringing you into my life. I have the purest intentions, and I just want to show you how to be treated right for real.  You deserve good things to come into your life, and I hope you achieve all your dreams and goals! I love sooooo many things about you, you are literally the best HAHA. I miss you so much and I hope I can see you soon. Stay safe and have a good shift - carlo aka your man aka your ball"
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
