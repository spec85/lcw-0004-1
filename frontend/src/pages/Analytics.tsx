import { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, Activity, DollarSign } from 'lucide-react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { formatCurrency, getCategoryColor } from '@/utils/format';

const COLORS = [
  '#14B8A6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#3B82F6',
  '#10B981',
  '#F97316',
  '#6366F1',
];

export default function Analytics() {
  const {
    categoryStats,
    trendData,
    statsSummary,
    fetchCategoryStats,
    fetchTrendData,
    fetchStatsSummary,
  } = useSubscriptionStore();

  useEffect(() => {
    fetchCategoryStats();
    fetchTrendData(6);
    fetchStatsSummary();
  }, [fetchCategoryStats, fetchTrendData, fetchStatsSummary]);

  const pieData = categoryStats.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const formatMonth = (month: string) => {
    const [year, mon] = month.split('-');
    return `${parseInt(mon)}月`;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">
          健康度分析
        </h1>
        <p className="text-slate-500 mt-2">了解您的订阅消费习惯，优化支出结构</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">月均支出</p>
              <p className="text-2xl font-display font-bold text-slate-900">
                {formatCurrency(statsSummary?.total_monthly || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">活跃订阅</p>
              <p className="text-2xl font-display font-bold text-slate-900">
                {statsSummary?.active_count || 0} 个
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <PieChartIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">订阅分类</p>
              <p className="text-2xl font-display font-bold text-slate-900">
                {categoryStats.length} 类
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">日均支出</p>
              <p className="text-2xl font-display font-bold text-slate-900">
                {formatCurrency((statsSummary?.total_monthly || 0) / 30)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
            分类支出占比
          </h2>
          <p className="text-sm text-slate-500 mb-6">各类别订阅的月度支出占比</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-sm text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
            支出趋势
          </h2>
          <p className="text-sm text-slate-500 mb-6">过去 6 个月的订阅支出趋势</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(value) => `¥${value}`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => formatMonth(label as string)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="月度支出"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0D9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-display font-bold text-slate-900">
            分类支出明细
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            按支出金额从高到低排序
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {categoryStats.length === 0 ? (
            <div className="p-12 text-center">
              <PieChartIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">暂无数据</p>
            </div>
          ) : (
            categoryStats.map((item, index) => (
              <div key={item.category} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">
                        {item.category}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-right w-20">
                    <span className="text-sm font-medium text-slate-500">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-card animate-slide-up" style={{ animationDelay: '700ms' }}>
          <h3 className="font-display font-bold text-lg mb-3">💡 省钱建议</h3>
          <p className="text-teal-100 text-sm leading-relaxed">
            定期检查您的订阅，取消不常用的服务。建议每季度进行一次订阅审计。
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-card animate-slide-up" style={{ animationDelay: '800ms' }}>
          <h3 className="font-display font-bold text-lg mb-3">📊 消费健康度</h3>
          <p className="text-violet-100 text-sm leading-relaxed">
            订阅支出建议不超过月收入的 5%，保持健康的消费习惯。
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-card animate-slide-up" style={{ animationDelay: '900ms' }}>
          <h3 className="font-display font-bold text-lg mb-3">⏰ 按时提醒</h3>
          <p className="text-amber-100 text-sm leading-relaxed">
            开启扣费提醒，在订阅自动续费前做出明智决定，避免不必要的支出。
          </p>
        </div>
      </div>
    </div>
  );
}
