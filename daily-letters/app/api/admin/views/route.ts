import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Letter from "@/models/Letter";
import LetterView from "@/models/LetterView";

export async function GET(req: Request) {
  const passcode = req.headers.get("x-admin-passcode");
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  // All letters (so we can show Day One/Two order)
  const letters = await Letter.find({})
    .sort({ date: 1 })
    .select({ date: 1, _id: 0 });

  // Aggregate views per letterDate
  const agg = await LetterView.aggregate([
    {
      $group: {
        _id: "$letterDate",
        views: { $sum: 1 },
        lastViewed: { $max: "$viewedAt" },
      },
    },
    { $project: { _id: 0, letterDate: "$_id", views: 1, lastViewed: 1 } },
  ]);

  const map = new Map<string, { views: number; lastViewed: string | null }>();
  for (const row of agg) {
    map.set(row.letterDate, {
      views: row.views ?? 0,
      lastViewed: row.lastViewed ? new Date(row.lastViewed).toISOString() : null,
    });
  }

  // Build stats in letter order
  const stats = letters.map((l: { date: string }, index: number) => {
    const s = map.get(l.date);
    return {
      dayNumber: index + 1,
      date: l.date,
      views: s?.views ?? 0,
      lastViewed: s?.lastViewed ?? null,
    };
  });

  // Recent activity (last 20 opens)
  const recent = await LetterView.find({})
    .sort({ viewedAt: -1 })
    .limit(20)
    .select({ letterDate: 1, viewedAt: 1, _id: 0 });

  return NextResponse.json({ stats, recent });
}
