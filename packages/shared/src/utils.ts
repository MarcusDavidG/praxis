export function calculateROI(initialValue: number, currentValue: number): number {
  if (initialValue === 0) return 0;
  return ((currentValue - initialValue) / initialValue) * 100;
}

export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return (wins / total) * 100;
}

export function formatCurrency(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function validatePaginationParams(
  page?: number,
  limit?: number,
  maxLimit: number = 100
): { page: number; limit: number } {
  const validPage = Math.max(1, page || 1);
  const validLimit = Math.min(maxLimit, Math.max(1, limit || 20));
  return { page: validPage, limit: validLimit };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
