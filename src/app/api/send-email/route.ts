import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const webhookUrlEmail = process.env.N8N_WEBHOOK_Email;

  if (!webhookUrlEmail) {
    return NextResponse.json(
      { error: "Webbook Url Email is not configured in ENV" },
      { status: 500 }
    );
  }

  try {
    const res = await axios.post(webhookUrlEmail, data, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    revalidatePath("/");

    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
