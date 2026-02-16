import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import LetterView from "@/models/LetterView";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const letterDate = String(body?.letterDate ?? "").trim();

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(letterDate)) {
    return NextResponse.json({ error: "Invalid letterDate" }, { status: 400 });
  }

  await connectMongo();

  const userAgent = req.headers.get("user-agent") ?? "";

  await LetterView.create({
    letterDate,
    userAgent,
  });

  return NextResponse.json({ ok: true });
}
