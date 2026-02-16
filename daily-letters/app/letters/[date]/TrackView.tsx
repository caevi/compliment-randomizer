"use client";

import { useEffect } from "react";

export default function TrackView({ letterDate }: { letterDate: string }) {
  useEffect(() => {
    fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letterDate }),
    }).catch(() => {});
  }, [letterDate]);

  return null;
}
