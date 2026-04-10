export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateInput(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
}
