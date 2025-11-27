export default function formatDate(raw: string) {
  if (!raw) return "";

  const [datePart, timePart] = raw.replace(",", "").trim().split(" ");

  if (!datePart || !timePart) return "";

  const [day, month, year] = datePart.split(".").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute, second);

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", raw);
    return "";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
