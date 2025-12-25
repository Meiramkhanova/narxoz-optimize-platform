import axios from "axios";
import https from "https";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const webhookUrlProtocol = process.env.N8N_WEBHOOK_Protocol;

  if (!webhookUrlProtocol) {
    return NextResponse.json(
      { error: "Webbook Url Protocol is not configured in ENV" },
      { status: 500 }
    );
  }

  try {
    const res = await axios.post(webhookUrlProtocol, data, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
