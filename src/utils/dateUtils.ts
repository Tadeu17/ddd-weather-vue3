const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" })


export function formatDate(date: Date): string {
  return formatter.format(date);
}
