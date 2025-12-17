import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function getCompliment() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/compliment`);
      const data = await res.json();
      setText(data.text);
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

        <h1 className="text-white font-semibold text-3xl sm:text-4xl mb-7">
          Press me.
        </h1>

        <button
          onClick={getCompliment}
          disabled={loading}
          className="tap-btn mx-auto w-full sm:w-auto px-6 py-4 sm:py-3
                     rounded-2xl text-base font-medium text-white
                     border border-white/15 bg-white/10
                     hover:bg-white/15 active:bg-white/20
                     transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "…loading" : "Press me"}
        </button>

        <div className="mt-8 sm:mt-10 min-h-[160px] sm:min-h-[170px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {text && (
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
                  (tap again for another)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-white/45 text-xs mt-8 sm:mt-10">
          i miss you... keep pressing theres a hidden message! 
        </p>
      </div>
    </div>
  );
}
