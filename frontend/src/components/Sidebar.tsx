import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Bell,
  PieChart,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/subscriptions', label: '订阅管理', icon: ListTodo },
  { path: '/alerts', label: '预警中心', icon: Bell },
  { path: '/analytics', label: '健康度分析', icon: PieChart },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">订阅管家</h1>
            <p className="text-xs text-slate-400">Subscription Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-teal-500/20 text-teal-400 border-l-4 border-teal-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-xl p-4">
          <p className="text-sm text-slate-300">本月支出</p>
          <p className="text-2xl font-display font-bold text-teal-400 mt-1">
            ¥ 1,287.50
          </p>
        </div>
      </div>
    </aside>
  );
}
