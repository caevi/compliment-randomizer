"use client";

import { useEffect, useMemo, useState } from "react";

type Stat = {
  dayNumber: number;
  date: string;
  views: number;
  lastViewed: string | null;
};

type Recent = {
  letterDate: string;
  viewedAt: string;
};

function numberToWord(n: number) {
  const words = [
    "One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen","Twenty"
  ];
  return words[n - 1] ?? String(n);
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminViewsPage() {
  const [passcode, setPasscode] = useState("");
  const [stats, setStats] = useState<Stat[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canAuth = useMemo(() => passcode.trim().length > 0, [passcode]);

  async function load() {
    if (!canAuth) {
      setMsg("Enter your admin passcode first.");
      return;
    }
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/views", {
        headers: { "x-admin-passcode": passcode },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error ?? "Failed to load views");
        setStats([]);
        setRecent([]);
        return;
      }

      setStats(data.stats ?? []);
      setRecent(data.recent ?? []);
      setMsg("Loaded ✅");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setStats([]);
    setRecent([]);
    setMsg("");
  }, [passcode]);

  const totalViews = stats.reduce((sum, s) => sum + (s.views ?? 0), 0);

  return (
    <main className="rom-wrap rom-fade">
      <div className="rom-header">
        <div>
          <h1 className="rom-title">Views</h1>
          <p className="rom-sub">
            Total opens: <b>{totalViews}</b>
          </p>
        </div>
        <div className="rom-pill">👀</div>
      </div>

      <section className="rom-card" style={{ marginBottom: 16 }}>
        <div className="rom-card-inner">
          <label className="rom-sub" style={{ display: "block", marginBottom: 8 }}>
            Admin Passcode
          </label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,180,210,0.45)",
              background: "rgba(255,255,255,0.75)",
              outline: "none",
            }}
          />

          <button
            onClick={load}
            disabled={loading || !canAuth}
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,180,210,0.45)",
              background: "rgba(255,255,255,0.75)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {loading ? "Loading..." : "Load Views"}
          </button>

          {msg && <p className="rom-sub" style={{ marginTop: 10 }}>{msg}</p>}
        </div>
      </section>

      <section className="rom-card" style={{ marginBottom: 16 }}>
        <div className="rom-card-inner">
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>By Day</h2>

          {stats.length === 0 ? (
            <p className="rom-sub" style={{ margin: 0 }}>No data yet.</p>
          ) : (
            <ul className="rom-list">
              {stats.map((s) => (
                <li className="rom-item" key={s.date}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderTop: "1px solid rgba(255, 180, 210, 0.22)",
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 800 }}>
                        💖 Day {numberToWord(s.dayNumber)}
                      </div>
                      <div className="rom-sub" style={{ margin: 0, fontSize: 12 }}>
                        {s.date}
                        {s.lastViewed ? ` • last: ${formatDateTime(s.lastViewed)}` : " • not opened yet"}
                      </div>
                    </div>

                    <div className="rom-pill" style={{ fontWeight: 800 }}>
                      {s.views} views
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <a className="rom-btn" href="/admin">← back to admin</a>
        </div>
      </section>

      <section className="rom-card">
        <div className="rom-card-inner">
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>Recent Opens</h2>

          {recent.length === 0 ? (
            <p className="rom-sub" style={{ margin: 0 }}>No recent opens.</p>
          ) : (
            <ul className="rom-list">
              {recent.map((r, i) => (
                <li key={`${r.letterDate}-${r.viewedAt}-${i}`}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderTop: "1px solid rgba(255, 180, 210, 0.22)",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{r.letterDate}</span>
                    <span className="rom-sub" style={{ margin: 0 }}>
                      {formatDateTime(r.viewedAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
