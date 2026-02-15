import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Letter from "@/models/Letter";
import { torontoTodayISO } from "@/lib/date";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isoToNumber(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return y * 10000 + m * 100 + d;
}

function isValidISODate(iso: string) {
  // format already checked before calling this
  const [y, m, d] = iso.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  // Real calendar validation
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function normalizeDateParam(input: string) {
  // decode + strip anything that's not digit or dash
  const raw = decodeURIComponent(input ?? "");
  return raw.replace(/[^0-9-]/g, "").trim();
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ date: string }> }
) {
  const { date: dateParam } = await ctx.params;

  const today = torontoTodayISO();
  const date = normalizeDateParam(dateParam);

  // Strict format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date) || !isValidISODate(date)) {
    return NextResponse.json(
      { error: "Invalid date. Use a real YYYY-MM-DD date." },
      { status: 400 }
    );
  }

  // Server-side lock
  if (isoToNumber(date) > isoToNumber(today)) {
    return NextResponse.json(
      { error: "Locked until that day." },
      { status: 403 }
    );
  }

  await connectMongo();

  // Exact match first
  let letter = await Letter.findOne({ date }).select({ date: 1, content: 1 });

  // Fallback: match stored whitespace junk
  if (!letter) {
    const pattern = `^${escapeRegex(date)}\\s*$`;
    letter = await Letter.findOne({ date: { $regex: pattern } }).select({
      date: 1,
      content: 1,
    });
  }

  if (!letter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Auto-repair stored date once (trim whitespace / normalize)
  if (letter.date !== date) {
    try {
      await Letter.updateOne({ _id: letter._id }, { $set: { date } });
      letter.date = date;
    } catch {
      // ignore conflicts
    }
  }

  // OPTIONAL: compute dayNumber among unlocked letters (so UI can show "Day One")
  // This avoids fetching /api/letters again on the letter page.
  const dayNumber = await Letter.countDocuments({ date: { $lte: date } });

  return NextResponse.json({
    date: letter.date,
    content: letter.content,
    dayNumber, // 1 = first unlocked letter, 2 = second, etc.
    today,
  });
}
