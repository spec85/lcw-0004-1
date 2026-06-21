export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getBillingCycleLabel(cycle: string): string {
  const labels: Record<string, string> = {
    weekly: '每周',
    monthly: '每月',
    quarterly: '每季度',
    yearly: '每年',
  };
  return labels[cycle] || cycle;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: '活跃',
    paused: '暂停',
    cancelled: '已取消',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-success-100 text-success-700',
    paused: 'bg-warning-100 text-warning-700',
    cancelled: 'bg-danger-100 text-danger-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getCategoryColor(category: string): string {
  const colors = [
    '#14B8A6',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#3B82F6',
    '#10B981',
    '#F97316',
    '#6366F1',
  ];
  const index = category.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getDaysUntilColor(days: number): string {
  if (days <= 2) return 'text-danger-600';
  if (days <= 7) return 'text-warning-600';
  return 'text-slate-600';
}
