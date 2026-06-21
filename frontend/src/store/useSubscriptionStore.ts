import { create } from 'zustand';
import type {
  Subscription,
  StatsSummary,
  CategoryStats,
  TrendData,
  AppSettings,
} from '@/types';

const API_BASE = 'http://localhost:5000/api';

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  statsSummary: StatsSummary | null;
  categoryStats: CategoryStats[];
  trendData: TrendData[];
  settings: AppSettings;

  fetchSubscriptions: (params?: {
    category?: string;
    status?: string;
    search?: string;
  }) => Promise<void>;
  fetchUpcomingSubscriptions: (days?: number) => Promise<Subscription[]>;
  createSubscription: (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSubscription: (id: number, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: number) => Promise<void>;

  fetchStatsSummary: () => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  fetchTrendData: (months?: number) => Promise<void>;

  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,
  statsSummary: null,
  categoryStats: [],
  trendData: [],
  settings: { alert_days: 7 },

  fetchSubscriptions: async (params) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/subscriptions?${query.toString()}`);
      const data = await res.json();
      set({ subscriptions: data, loading: false });
    } catch (error) {
      set({ error: '获取订阅列表失败', loading: false });
    }
  },

  fetchUpcomingSubscriptions: async (days = 7) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/upcoming?days=${days}`);
      return await res.json();
    } catch (error) {
      return [];
    }
  },

  createSubscription: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('创建失败');
      set({ loading: false });
      await get().fetchSubscriptions();
      await get().fetchStatsSummary();
    } catch (error) {
      set({ error: '创建订阅失败', loading: false });
    }
  },

  updateSubscription: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('更新失败');
      set({ loading: false });
      await get().fetchSubscriptions();
      await get().fetchStatsSummary();
    } catch (error) {
      set({ error: '更新订阅失败', loading: false });
    }
  },

  deleteSubscription: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('删除失败');
      set({ loading: false });
      await get().fetchSubscriptions();
      await get().fetchStatsSummary();
    } catch (error) {
      set({ error: '删除订阅失败', loading: false });
    }
  },

  fetchStatsSummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/stats/summary`);
      const data = await res.json();
      set({ statsSummary: data });
    } catch (error) {
      console.error('获取统计数据失败');
    }
  },

  fetchCategoryStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/stats/by-category`);
      const data = await res.json();
      set({ categoryStats: data });
    } catch (error) {
      console.error('获取分类统计失败');
    }
  },

  fetchTrendData: async (months = 6) => {
    try {
      const res = await fetch(`${API_BASE}/stats/trend?months=${months}`);
      const data = await res.json();
      set({ trendData: data });
    } catch (error) {
      console.error('获取趋势数据失败');
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();
      set({ settings: data });
    } catch (error) {
      console.error('获取设置失败');
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      set({ settings: data });
    } catch (error) {
      console.error('更新设置失败');
    }
  },
}));
