import { useEffect, useState } from 'react';
import {
  Wallet,
  CreditCard,
  Bell,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/StatCard';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  formatCurrency,
  formatDateShort,
  getDaysUntil,
  getStatusColor,
  getStatusLabel,
  getDaysUntilColor,
} from '@/utils/format';
import type { Subscription } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { statsSummary, fetchStatsSummary, fetchUpcomingSubscriptions, settings, fetchSettings } =
    useSubscriptionStore();
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    fetchStatsSummary();
    fetchSettings();
  }, [fetchStatsSummary, fetchSettings]);

  useEffect(() => {
    if (settings.alert_days) {
      fetchUpcomingSubscriptions(settings.alert_days).then(setUpcomingSubscriptions);
    }
  }, [settings.alert_days, fetchUpcomingSubscriptions]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">
          欢迎回来 👋
        </h1>
        <p className="text-slate-500 mt-2">这里是您的订阅概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="本月总支出"
          value={formatCurrency(statsSummary?.total_monthly || 0)}
          icon={Wallet}
          color="teal"
          trend="较上月 +5.2%"
          trendUp={false}
          delay={0}
        />
        <StatCard
          title="活跃订阅"
          value={statsSummary?.active_count || 0}
          icon={CreditCard}
          color="violet"
          delay={100}
        />
        <StatCard
          title="本月待扣费"
          value={statsSummary?.upcoming_count || 0}
          icon={Bell}
          color="amber"
          delay={200}
        />
        <StatCard
          title="日均支出"
          value={formatCurrency((statsSummary?.total_monthly || 0) / 30)}
          icon={TrendingUp}
          color="rose"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">
                  即将扣费
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  未来 {settings.alert_days} 天内即将扣费的订阅
                </p>
              </div>
              <button
                onClick={() => navigate('/alerts')}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
              >
                查看全部
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingSubscriptions.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">近期没有即将扣费的订阅</p>
                </div>
              ) : (
                upcomingSubscriptions.slice(0, 5).map((sub, index) => {
                  const daysUntil = getDaysUntil(sub.next_billing_date);

                  return (
                    <div
                      key={sub.id}
                      className="p-5 hover:bg-slate-50 transition-colors flex items-center gap-4"
                      style={{ animationDelay: `${500 + index * 100}ms` }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900">
                            {sub.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              sub.status
                            )}`}
                          >
                            {getStatusLabel(sub.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-slate-500">
                            {formatDateShort(sub.next_billing_date)}
                          </span>
                          <span className="text-sm text-slate-400">•</span>
                          <span className="text-sm text-slate-500">
                            {sub.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-display font-bold text-slate-900">
                          {formatCurrency(sub.amount)}
                        </p>
                        <p className={`text-sm font-medium ${getDaysUntilColor(daysUntil)}`}>
                          {daysUntil === 0
                            ? '今天扣费'
                            : daysUntil === 1
                            ? '明天扣费'
                            : `还有 ${daysUntil} 天`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-card animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">扣费提醒</h3>
            </div>
            <p className="text-teal-100 text-sm mb-4">
              系统会在扣费前 {settings.alert_days} 天提醒您，避免忘记取消订阅
            </p>
            <button
              onClick={() => navigate('/alerts')}
              className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm"
            >
              管理预警设置
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
            <h3 className="font-display font-bold text-slate-900 mb-4">快捷操作</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/subscriptions')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">管理订阅</p>
                  <p className="text-sm text-slate-500">添加或编辑订阅</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/analytics')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">消费分析</p>
                  <p className="text-sm text-slate-500">查看支出趋势</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
