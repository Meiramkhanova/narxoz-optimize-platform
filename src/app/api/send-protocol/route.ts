import axios from "axios";
import https from "https";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res = await axios.post(
      "https://n8n.contractpro.kz/webhook/af3247f9-462a-4d85-bf8d-226d76c91702",
      data,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }
    );

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
