import { formFields } from "@/widgets/components/ResultCard";

export async function submitProtocol(data: formFields): Promise<any> {
  const response = await fetch(
    "https://n8n.contractpro.kz/webhook/af3247f9-462a-4d85-bf8d-226d76c91702",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка при отправке: ${errorText}`);
  }

  return response.json();
}
