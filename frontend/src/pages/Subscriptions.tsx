import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import SubscriptionForm from '@/components/SubscriptionForm';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  formatCurrency,
  formatDate,
  getBillingCycleLabel,
  getStatusColor,
  getStatusLabel,
  getDaysUntil,
  getDaysUntilColor,
} from '@/utils/format';
import { CATEGORIES } from '@/types';
import type { Subscription } from '@/types';

export default function Subscriptions() {
  const { subscriptions, fetchSubscriptions, createSubscription, updateSubscription, deleteSubscription } =
    useSubscriptionStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchSubscriptions({
      category: filterCategory || undefined,
      search: searchTerm || undefined,
    });
  }, [fetchSubscriptions, filterCategory, searchTerm]);

  const handleCreate = (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    createSubscription(data);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsFormOpen(true);
  };

  const handleUpdate = (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个订阅吗？')) {
      await deleteSubscription(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            订阅管理
          </h1>
          <p className="text-slate-500 mt-2">
            管理您的所有订阅服务，共 {subscriptions.length} 个
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          新增订阅
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索订阅..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              showFilter
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            筛选
          </button>
        </div>

        {showFilter && (
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === ''
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                全部分类
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-teal-500 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  服务名称
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  金额
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  周期
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  下次扣费
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  分类
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  状态
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="text-slate-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-500 mb-4">暂无订阅</p>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      添加第一个订阅
                    </button>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const daysUntil = getDaysUntil(sub.next_billing_date);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                            <span className="text-base">📦</span>
                          </div>
                          <span className="font-medium text-slate-900">
                            {sub.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(sub.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {getBillingCycleLabel(sub.billing_cycle)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-900">
                            {formatDate(sub.next_billing_date)}
                          </p>
                          <p className={`text-sm font-medium ${getDaysUntilColor(daysUntil)}`}>
                            {daysUntil > 0
                              ? `还有 ${daysUntil} 天`
                              : daysUntil === 0
                              ? '今天'
                              : `已逾期 ${Math.abs(daysUntil)} 天`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                          {sub.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            sub.status
                          )}`}
                        >
                          {getStatusLabel(sub.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingSubscription ? handleUpdate : handleCreate}
        subscription={editingSubscription}
      />
    </div>
  );
}
