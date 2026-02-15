import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Letter from "@/models/Letter";

export async function POST(req: Request) {
  const passcode = req.headers.get("x-admin-passcode");

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const date = String(body?.date ?? "").trim();
  const content = String(body?.content ?? "");

  if (!date || !content) {
    return NextResponse.json({ error: "Missing date/content" }, { status: 400 });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  await connectMongo();

  await Letter.updateOne(
    { date },
    { $set: { content } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
