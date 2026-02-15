import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  // ✅ Prefer env var (Render)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  // ✅ Fallback (local / other hosts)
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

const numberToWord = (n: number) => {
  const words = [
    "One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen","Twenty"
  ];
  return words[n - 1] ?? n;
};

export default async function LettersPage() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/letters`, { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="rom-wrap rom-fade">
      <FloatingHearts />

      <div className="rom-header">
        <div>
          <h1 className="rom-title">My Letters 2 You</h1>
          <p className="rom-sub">
            One day at a time baby🤍
          </p>
        </div>
        <div className="rom-pill">💌</div>
      </div>

      <section className="rom-card">
        <div className="rom-card-inner">
          {data.letters?.length ? (
            <ul className="rom-list">
              {data.letters.map((l: { date: string }, index: number) => (
                <li className="rom-item" key={l.date}>
                  <a href={`/letters/${l.date}`}>
                    <div style={{ display: "grid", gap: 4 }}>
  <span className="rom-date">💖 Day {numberToWord(index + 1)}</span>
  <span className="rom-sub" style={{ margin: 0, fontSize: 12 }}>
    tap to open
  </span>
</div>
<span className="rom-arrow">›</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rom-sub" style={{ margin: 0 }}>
              No letters yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function FloatingHearts() {
  return (
    <div className="floating-hearts">
      <span>🤍</span>
      <span>💖</span>
      <span>💕</span>
      <span>🤍</span>
      <span>💗</span>
    </div>
  );
}
