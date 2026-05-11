import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { CheckCheck, Clock3, ListTodo, TriangleAlert, TrendingUp, Calendar, Activity, Target } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import AppLayout from "../layout/AppLayout";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const popUp = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [progressByStatus, setProgressByStatus] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardResponse, tasksResponse] = await Promise.all([
          axiosClient.get("/tasks/dashboard"),
          axiosClient.get("/tasks")
        ]);
        setStats(dashboardResponse.data.stats);
        setProgressByStatus(dashboardResponse.data.progressByStatus);
        setTasks(tasksResponse.data.tasks || []);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const weeklyProductivity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    completed: Math.floor(Math.random() * 5) + (day === "Fri" ? 3 : 1)
  }));

  const recentActivity = tasks.slice(0, 5).map((task) => ({
    id: task._id,
    message: `Task "${task.title}" is ${task.status.replace("_", " ")}`
  }));

  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const completionRate = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const statCards = [
    { icon: ListTodo, label: "Total", value: stats.totalTasks, gradient: "from-indigo-500 to-violet-600", bg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { icon: CheckCheck, label: "Done", value: stats.completedTasks, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { icon: Clock3, label: "Pending", value: stats.pendingTasks, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", iconColor: "text-amber-600" },
    { icon: TriangleAlert, label: "Overdue", value: stats.overdueTasks, gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", iconColor: "text-rose-600" }
  ];

  return (
    <AppLayout pageTitle={user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Activity size={32} className="text-violet-500" />
          </motion.div>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Top row: greeting + date in a horizontal banner */}
          <motion.div variants={slideIn} className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl shadow-indigo-500/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-200">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]} 👋
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-indigo-200">Completion Rate</p>
                <p className="text-3xl font-black">{completionRate}%</p>
              </div>
              <div className="h-14 w-14 rounded-full border-4 border-white/30 p-1">
                <div className="grid h-full w-full place-items-center rounded-full bg-white/20">
                  <Target size={20} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stat cards — horizontal scroll on mobile, inline row on desktop */}
          <motion.div variants={stagger} className="mb-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  variants={popUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex min-w-[180px] flex-1 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition"
                >
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${card.bg}`}>
                    <Icon size={22} className={card.iconColor} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {stats.totalTasks === 0 ? (
            <EmptyState
              title="No tasks available yet"
              subtitle="Create tasks to unlock progress charts and analytics."
            />
          ) : (
            <>
              {/* Bento grid: chart area + pie + progress ring */}
              <motion.div variants={stagger} className="mb-6 grid gap-4 lg:grid-cols-12">
                {/* Area chart — wide */}
                <motion.div variants={popUp} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-7">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Weekly Productivity</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                      <TrendingUp size={12} /> Trending up
                    </span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <AreaChart data={weeklyProductivity}>
                        <defs>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                        />
                        <Area type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorCompleted)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Right column: pie + donut stacked */}
                <motion.div variants={popUp} className="flex flex-col gap-4 lg:col-span-5">
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-2 text-sm font-bold text-slate-700">Status Breakdown</h3>
                    <div className="h-48">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={progressByStatus} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40} paddingAngle={4}>
                            {progressByStatus.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 shadow-sm">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-500">Overall Progress</p>
                    <div className="flex items-center gap-4">
                      <div
                        className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
                        style={{ background: `conic-gradient(#7c3aed ${completionRate * 3.6}deg, #e2e8f0 0deg)` }}
                      >
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-black text-violet-700">
                          {completionRate}%
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{stats.completedTasks} of {stats.totalTasks}</p>
                        <p className="text-xs text-slate-500">tasks completed</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom: activity + deadlines, side-by-side but reversed order */}
              <motion.div variants={stagger} className="grid gap-4 lg:grid-cols-5">
                <motion.div variants={slideIn} className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-slate-700">Upcoming Deadlines</h3>
                  </div>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400">No upcoming deadlines.</p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingDeadlines.map((task, i) => (
                        <motion.div
                          key={task._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
                        >
                          <p className="text-sm font-semibold text-slate-700 truncate max-w-[60%]">{task.title}</p>
                          <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
                <motion.div variants={slideIn} className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity size={16} className="text-violet-500" />
                    <h3 className="text-sm font-bold text-slate-700">Recent Activity</h3>
                  </div>
                  {recentActivity.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400">No activity yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {recentActivity.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08, type: "spring", stiffness: 120 }}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5"
                        >
                          <div className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                          <p className="text-sm font-medium text-slate-600">{item.message}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
