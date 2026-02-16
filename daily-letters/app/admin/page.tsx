"use client";

import { useState } from "react";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function saveLetter() {
    setMsg("");

    const res = await fetch("/api/admin/letters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode,
      },
      body: JSON.stringify({ date, content }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error ?? "Error saving letter");
      return;
    }

    setMsg("Saved ✅");
    setContent("");
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Admin</h1>

      <label style={{ display: "block", marginBottom: 6 }}>Admin Passcode</label>
      <input
        type="password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 14 }}
      />

      <label style={{ display: "block", marginBottom: 6 }}>Date (YYYY-MM-DD)</label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="2026-02-14"
        style={{ width: "100%", padding: 10, marginBottom: 14 }}
      />

      <label style={{ display: "block", marginBottom: 6 }}>Letter</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: "100%", padding: 10, marginBottom: 14 }}
      />

      <button onClick={saveLetter} style={{ padding: "10px 16px", cursor: "pointer" }}>
        Save Letter
      </button>

      {msg && <p style={{ marginTop: 14 }}>{msg}</p>}

      <hr style={{ margin: "24px 0" }} />
      
<p style={{ marginTop: 10 }}>
  <a href="/admin/views" style={{ textDecoration: "underline" }}>
    View opens / analytics →
  </a>
</p>

      <p>
        View her page:{" "}
        <a href="/letters" style={{ textDecoration: "underline" }}>
          /letters
        </a>
      </p>
    </main>
  );
}
