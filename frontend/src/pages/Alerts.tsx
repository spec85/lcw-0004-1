import { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  Settings,
  Check,
  CalendarClock,
  X,
} from 'lucide-react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getDaysUntil,
  getDaysUntilColor,
} from '@/utils/format';
import type { Subscription } from '@/types';

export default function Alerts() {
  const { settings, fetchSettings, updateSettings, fetchUpcomingSubscriptions } =
    useSubscriptionStore();
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempAlertDays, setTempAlertDays] = useState(7);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setTempAlertDays(settings.alert_days);
    fetchUpcomingSubscriptions(settings.alert_days).then(setUpcomingSubscriptions);
  }, [settings.alert_days, fetchUpcomingSubscriptions]);

  const handleSaveSettings = () => {
    updateSettings({ alert_days: tempAlertDays });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempAlertDays(settings.alert_days);
    setIsEditing(false);
  };

  const urgentCount = upcomingSubscriptions.filter(
    (sub) => getDaysUntil(sub.next_billing_date) <= 2
  ).length;

  const totalAmount = upcomingSubscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">
          预警中心
        </h1>
        <p className="text-slate-500 mt-2">
          及时了解即将扣费的订阅，避免不必要的支出
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-card animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-amber-100 text-sm">紧急预警</p>
          <p className="text-3xl font-display font-bold mt-1">{urgentCount}</p>
          <p className="text-amber-100 text-sm mt-1">2 天内即将扣费</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">本期预警</p>
          <p className="text-3xl font-display font-bold text-slate-900 mt-1">
            {upcomingSubscriptions.length}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            未来 {settings.alert_days} 天内
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <CalendarClock className="w-6 h-6 text-violet-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">预计支出</p>
          <p className="text-3xl font-display font-bold text-slate-900 mt-1">
            {formatCurrency(totalAmount)}
          </p>
          <p className="text-slate-500 text-sm mt-1">即将扣费总额</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">
                预警列表
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                以下订阅将在 {settings.alert_days} 天内扣费
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingSubscriptions.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    一切正常
                  </h3>
                  <p className="text-slate-500">
                    近期没有即将扣费的订阅，请放心 ~
                  </p>
                </div>
              ) : (
                upcomingSubscriptions.map((sub, index) => {
                  const daysUntil = getDaysUntil(sub.next_billing_date);
                  const isUrgent = daysUntil <= 2;

                  return (
                    <div
                      key={sub.id}
                      className={`p-6 hover:bg-slate-50 transition-colors ${
                        isUrgent ? 'bg-amber-50/50' : ''
                      }`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isUrgent
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                              : 'bg-gradient-to-br from-teal-400 to-emerald-500'
                          }`}
                        >
                          <Bell className="w-7 h-7 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {sub.name}
                            </h3>
                            {isUrgent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse-soft">
                                <Clock className="w-3 h-3" />
                                紧急
                              </span>
                            )}
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                sub.status
                              )}`}
                            >
                              {getStatusLabel(sub.status)}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-6 flex-wrap">
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">
                                扣费金额
                              </p>
                              <p className="font-bold text-slate-900">
                                {formatCurrency(sub.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">
                                扣费日期
                              </p>
                              <p className="font-medium text-slate-700">
                                {formatDate(sub.next_billing_date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">
                                分类
                              </p>
                              <p className="font-medium text-slate-700">
                                {sub.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className={`text-2xl font-display font-bold ${getDaysUntilColor(daysUntil)}`}>
                            {daysUntil === 0
                              ? '今天'
                              : daysUntil === 1
                              ? '明天'
                              : `${daysUntil} 天`}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">后扣费</p>
                        </div>
                      </div>

                      {isUrgent && (
                        <div className="mt-4 p-3 bg-amber-100/50 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">
                              注意：即将扣费
                            </p>
                            <p className="text-xs text-amber-600 mt-0.5">
                              如果您不想继续使用此订阅，请尽快取消，以免产生不必要的费用
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-lg font-display font-bold text-slate-900">
                  预警设置
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  提前预警天数
                </label>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={tempAlertDays}
                        onChange={(e) =>
                          setTempAlertDays(parseInt(e.target.value))
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                      <span className="w-16 text-center text-xl font-bold text-slate-900">
                        {tempAlertDays} 天
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {[3, 7, 14, 30].map((days) => (
                        <button
                          key={days}
                          onClick={() => setTempAlertDays(days)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            tempAlertDays === days
                              ? 'bg-teal-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {days}天
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <div>
                      <p className="text-3xl font-display font-bold text-slate-900">
                        {settings.alert_days} 天
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        提前 {settings.alert_days} 天提醒
                      </p>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-teal-50 rounded-xl">
                <p className="text-sm text-teal-800 font-medium">💡 小提示</p>
                <p className="text-sm text-teal-600 mt-2">
                  建议设置 7 天预警期，这样您有充足的时间决定是否继续订阅，避免冲动消费。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
