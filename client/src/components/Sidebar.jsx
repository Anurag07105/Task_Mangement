import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  FolderKanban,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`top-0 border-b border-r border-slate-200 bg-white/90 px-3 py-4 shadow-sm backdrop-blur md:sticky md:h-screen md:border-b-0 ${
        collapsed ? "md:w-20" : "md:w-72"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 font-bold text-white shadow-sm">
            T
          </span>
          {!collapsed && <span className="text-lg font-bold">Team Tasks</span>}
        </Link>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          type="button"
          className="hidden rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-400 transition hover:text-brand-600 md:block"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && (
        <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          {user?.name} ({user?.role})
        </p>
      )}

      <nav className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 md:block md:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `block rounded-xl ${isActive ? "border border-brand-100 bg-brand-50 shadow-sm" : ""}`}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? "text-brand-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {!collapsed && item.label}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        onClick={logout}
        type="button"
      >
        <LogOut size={16} />
        {!collapsed && "Logout"}
      </button>

      {!collapsed && (
        <p className="absolute bottom-4 left-3 right-3 border-t border-slate-100 pt-3 text-center text-xs font-medium text-slate-400">
          Team Task Manager v1.0
        </p>
      )}
    </aside>
  );
};

export default Sidebar;
