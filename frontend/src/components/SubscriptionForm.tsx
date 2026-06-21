import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil } from 'lucide-react';
import Modal from './Modal';
import { CATEGORIES, BILLING_CYCLES, STATUS_OPTIONS } from '@/types';
import type { Subscription } from '@/types';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => void;
  subscription?: Subscription | null;
}

export default function SubscriptionForm({
  isOpen,
  onClose,
  onSubmit,
  subscription,
}: SubscriptionFormProps) {
  const isEditing = !!subscription;

  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    billing_cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    next_billing_date: string;
    category: string;
    status: 'active' | 'paused' | 'cancelled';
  }>({
    name: '',
    amount: '',
    billing_cycle: 'monthly',
    next_billing_date: '',
    category: '',
    status: 'active',
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount.toString(),
        billing_cycle: subscription.billing_cycle,
        next_billing_date: subscription.next_billing_date,
        category: subscription.category,
        status: subscription.status,
      });
    } else {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setFormData({
        name: '',
        amount: '',
        billing_cycle: 'monthly',
        next_billing_date: nextMonth.toISOString().split('T')[0],
        category: '',
        status: 'active',
      });
    }
  }, [subscription, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.next_billing_date || !formData.category) {
      return;
    }

    onSubmit({
      name: formData.name,
      amount: parseFloat(formData.amount),
      billing_cycle: formData.billing_cycle,
      next_billing_date: formData.next_billing_date,
      category: formData.category,
      status: formData.status,
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? '编辑订阅' : '新增订阅'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            服务名称
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="例如：Netflix"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              扣费金额 (¥)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              结算周期
            </label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => handleChange('billing_cycle', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white"
            >
              {BILLING_CYCLES.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              下次扣费日期
            </label>
            <input
              type="date"
              value={formData.next_billing_date}
              onChange={(e) => handleChange('next_billing_date', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              分类
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all bg-white"
            >
              <option value="">请选择分类</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            状态
          </label>
          <div className="flex gap-3">
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status.value}
                className={`flex-1 cursor-pointer`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={formData.status === status.value}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="sr-only peer"
                />
                <div className={`px-4 py-3 rounded-xl border-2 text-center font-medium transition-all
                  ${formData.status === status.value
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {status.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
          >
            {isEditing ? (
              <><Pencil className="w-4 h-4" /> 保存修改</>
            ) : (
              <><Plus className="w-4 h-4" /> 添加订阅</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
