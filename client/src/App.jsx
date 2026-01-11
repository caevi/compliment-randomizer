import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const UNLOCK_AT = 15;

const LETTER = `
have u ever looked at someone and just admired them?
looked at someone with the most pure intentions?
looked at someone and just knew — yeah, it’s them?

lately… i have.

when i look at you, it’s not just a crush.
these feelings are strong in a way i’ve never felt before.
i crave your presence.
i picture a future and actually want it to happen.

i haven’t been in a relationship in years,
so this is all new to me.
but i’m grateful for you.
so grateful.

you’re such a beautiful soul,
and you’re genuinely my favorite person.
I cannot wait for the day I could finally call
you my girlfriend. But I have a whole plan for that.



Anyways in all honesty… i don’t just like you.

i love you.

and i wanted this moment to feel special.
that’s why i was so hesitant to post this.



❤️
`;

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ no persistence: refresh resets taps
  const [taps, setTaps] = useState(0);

  const unlocked = taps >= UNLOCK_AT;

  async function getCompliment() {
    if (unlocked) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/compliment`);
      const data = await res.json();
      setText(data.text);
      setTaps((t) => t + 1);
    } catch {
      setText("Something glitched… but you’re still the vibe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-xl text-center">
        <p className="text-white/70 text-sm sm:text-base mb-2 tracking-wide">
          just a little thing i made for you ❤️
        </p>

        <h1 className="text-white font-semibold text-3xl sm:text-4xl mb-6">
          {unlocked ? "For you." : "Press me."}
        </h1>

        {!unlocked && (
          <button
            onClick={getCompliment}
            disabled={loading}
            className="tap-btn mx-auto w-full sm:w-auto px-6 py-4 sm:py-3
                       rounded-2xl text-base font-medium text-white
                       border border-white/15 bg-white/10
                       hover:bg-white/15 active:bg-white/20
                       transition disabled:opacity-60"
          >
            {loading ? "…loading" : "Press me"}
          </button>
        )}

        <div className="mt-8 sm:mt-10 min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!unlocked && text && (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="glass-card w-full rounded-3xl px-6 py-6 sm:px-8 sm:py-7"
              >
                <p className="text-white text-xl sm:text-2xl leading-snug">
                  {text}
                </p>
                <p className="text-white/60 mt-3 text-sm">
                  ({UNLOCK_AT - taps} taps left)
                </p>
              </motion.div>
            )}

            {unlocked && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass-card w-full rounded-3xl px-6 py-8 sm:px-8 sm:py-10"
              >
                <p className="text-white text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {LETTER}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!unlocked && (
          <p className="text-white/45 text-xs mt-8">
            keep pressing… there’s something waiting for you
          </p>
        )}
      </div>
    </div>
  );
}
