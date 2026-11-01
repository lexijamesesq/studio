const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

export function formatDay(value: Date): string {
  return day.format(value);
}

export function formatIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
