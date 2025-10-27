export function getString(form: FormData, key: string, fallback = ""): string {
  const v = form.get(key);
  if (typeof v !== "string") return fallback;
  return v.trim();
}
