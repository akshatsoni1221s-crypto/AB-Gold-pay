export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(num: number | string | null | undefined): string {
  const n = typeof num === 'string' ? parseFloat(num) : num ?? 0;
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWeight(weight: number | string | null | undefined): string {
  const w = typeof weight === 'string' ? parseFloat(weight) : weight ?? 0;
  return `${w.toFixed(3)} g`;
}

export function formatPercent(value: number | string | null | undefined): string {
  const v = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return `${v.toFixed(2)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function maskPhone(phone: string): string {
  return `${phone.slice(0, 2)}****${phone.slice(-2)}`;
}

export function generateInvoiceNo(type: string, count: number): string {
  const prefix = type === 'GST' ? 'GST' : type === 'PURCHASE' ? 'PUR' : 'INV';
  const year = new Date().getFullYear().toString().slice(-2);
  const num = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${num}`;
}

export function generateSKU(category: string, metal: string, count: number): string {
  const cat = category.slice(0, 3).toUpperCase();
  const met = metal.slice(0, 2).toUpperCase();
  const num = String(count + 1).padStart(5, '0');
  return `${cat}-${met}-${num}`;
}

export function generateBarcode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GP${timestamp}${random}`;
}
