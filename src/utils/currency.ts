const formatter = new Intl.NumberFormat("en-GH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a cedi amount as "GHS 1,250.00". */
export function formatGHS(amount: number): string {
  return `GHS ${formatter.format(amount)}`;
}
