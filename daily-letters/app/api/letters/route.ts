import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Letter from "@/models/Letter";
import { torontoTodayISO } from "@/lib/date";

export async function GET() {
  await connectMongo();

  const today = torontoTodayISO();

  const letters = await Letter.find({ date: { $lte: today } })
    .sort({ date: 1 })
    .select({ date: 1, _id: 0 });

  return NextResponse.json({ today, letters });
}
