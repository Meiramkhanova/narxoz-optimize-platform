export default function parseContacts(raw: string) {
  const parts = raw
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  let phone: string | null = null;
  let email: string | null = null;

  for (const p of parts) {
    if (p.includes("@")) email = p;
    else phone = p;
  }

  return { phone, email };
}
