export interface Subscription {
  id: number;
  name: string;
  amount: number;
  billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  next_billing_date: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface StatsSummary {
  total_monthly: number;
  active_count: number;
  upcoming_count: number;
}

export interface CategoryStats {
  category: string;
  amount: number;
  percentage: number;
}

export interface TrendData {
  month: string;
  amount: number;
}

export interface AppSettings {
  alert_days: number;
}

export type BillingCycle = Subscription['billing_cycle'];
export type SubscriptionStatus = Subscription['status'];

export const CATEGORIES = [
  '娱乐',
  '音乐',
  '工具',
  '效率',
  '阅读',
  '购物',
  '教育',
  '其他',
] as const;

export const BILLING_CYCLES = [
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'quarterly', label: '每季度' },
  { value: 'yearly', label: '每年' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'active', label: '活跃', color: 'success' },
  { value: 'paused', label: '暂停', color: 'warning' },
  { value: 'cancelled', label: '已取消', color: 'danger' },
] as const;
