// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    "https://n8n.contractpro.kz/webhook/b8c82131-b396-48f4-ad4d-4b222f8883a9",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  console.log("Ответ от webhookы:", data);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Ошибка отправки на почту" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
