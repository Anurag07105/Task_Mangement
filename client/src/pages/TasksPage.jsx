import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, LayoutGrid, List, Plus, Search, GripVertical, Flag, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../api/axiosClient";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const statusConfig = {
  todo: { label: "Todo", color: "bg-slate-100 border-slate-200 text-slate-800", dot: "bg-slate-400", headerBg: "from-slate-500 to-slate-600" },
  in_progress: { label: "In Progress", color: "bg-amber-50 border-amber-200 text-amber-800", dot: "bg-amber-400", headerBg: "from-amber-500 to-orange-500" },
  done: { label: "Done", color: "bg-emerald-50 border-emerald-200 text-emerald-800", dot: "bg-emerald-400", headerBg: "from-emerald-500 to-teal-500" }
};

const priorityConfig = {
  low: { color: "text-sky-600 bg-sky-50", label: "Low" },
  medium: { color: "text-amber-600 bg-amber-50", label: "Medium" },
  high: { color: "text-rose-600 bg-rose-50", label: "High" }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 16 } }
};

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", dueDate: "" });
  const [view, setView] = useState("kanban");
  const [dragTask, setDragTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const createDateRef = useRef(null);
  const filterDateRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    dueDate: ""
  });

  const loadTasks = async () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.dueDate) params.dueDate = filters.dueDate;
    const { data } = await axiosClient.get("/tasks", { params });
    const filtered = filters.dueDate
      ? data.tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate).toDateString() === new Date(filters.dueDate).toDateString()
        )
      : data.tasks;
    setTasks(filtered);
  };

  const loadProjects = async () => {
    const { data } = await axiosClient.get("/projects");
    setProjects(data.projects);
  };

  const loadUsers = async () => {
    const { data } = await axiosClient.get("/auth/users");
    setUsers(data.users);
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
    if (user?.role === "admin") loadUsers();
  }, [user?.role]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, dueDate: form.dueDate || undefined };
      await axiosClient.post("/tasks", payload);
      toast.success("Task created.");
      setForm({ title: "", description: "", projectId: "", assignedTo: "", status: "todo", priority: "medium", dueDate: "" });
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task.");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await axiosClient.patch(`/tasks/${taskId}`, { status });
      toast.success("Task status updated.");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task.");
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done")
  };

  const selectedProject = projects.find((project) => project._id === form.projectId);
  const projectAssignees = selectedProject?.members?.length
    ? selectedProject.members
        .map((member) => users.find((userItem) => userItem._id === member._id) || member)
        .filter(Boolean)
    : [];

  const onDropColumn = async (status) => {
    if (!dragTask || dragTask.status === status) return;
    await updateStatus(dragTask._id, status);
    setDragTask(null);
  };

  const inputClass = "rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10";

  return (
    <AppLayout pageTitle={user?.role === "admin" ? "Tasks & Workflow" : "My Tasks"}>
      {/* Top controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {/* View toggle */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {[
            { key: "kanban", icon: LayoutGrid, label: "Board" },
            { key: "table", icon: List, label: "List" }
          ].map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.key}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  view === v.key ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                }`}
                onClick={() => setView(v.key)}
                type="button"
              >
                <Icon size={14} />
                {v.label}
              </button>
            );
          })}
        </div>

        {user?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setShowCreate((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20"
          >
            <Plus size={14} />
            New Task
          </motion.button>
        )}
      </div>

      {/* Create task panel */}
      <AnimatePresence>
        {user?.role === "admin" && showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={createTask}
            className="mb-6 overflow-hidden"
          >
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-3">
              <input className={inputClass} placeholder="Task title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
              <input className={inputClass} placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <input ref={createDateRef} className="w-full bg-transparent p-2 text-sm text-slate-900" type="date" value={form.dueDate} onFocus={() => createDateRef.current?.showPicker?.()} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
                <button type="button" className="rounded-lg p-1 text-slate-400 hover:text-slate-700" onClick={() => createDateRef.current?.showPicker?.()}><CalendarDays size={15} /></button>
              </div>
              <select className={inputClass} value={form.projectId} onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value, assignedTo: "" }))} required>
                <option value="">Select project</option>
                {projects.map((project) => (<option key={project._id} value={project._id}>{project.name}</option>))}
              </select>
              <select className={inputClass} value={form.assignedTo} onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))} required disabled={!form.projectId}>
                <option value="">{form.projectId ? "Assign to member" : "Select project first"}</option>
                {projectAssignees.map((a) => (<option key={a._id} value={a._id}>{a.name} {a.role ? `(${a.role})` : ""}</option>))}
              </select>
              <select className={inputClass} value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-violet-700 lg:col-span-3">Create Task</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter bar — compact horizontal strip */}
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
        <div className="relative flex-1 min-w-[140px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2.5 pl-8 pr-3 text-sm text-slate-900 outline-none focus:border-violet-400"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <select className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
          <option value="">Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none" value={filters.priority} onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}>
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex rounded-lg border border-slate-100 bg-slate-50 p-0.5">
          <input ref={filterDateRef} className="bg-transparent px-2 py-2 text-xs text-slate-900" type="date" value={filters.dueDate} onFocus={() => filterDateRef.current?.showPicker?.()} onChange={(e) => setFilters((prev) => ({ ...prev, dueDate: e.target.value }))} />
          <button type="button" className="p-1 text-slate-400 hover:text-slate-700" onClick={() => filterDateRef.current?.showPicker?.()}><CalendarDays size={14} /></button>
        </div>
        <button onClick={loadTasks} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo-700">Apply</button>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" subtitle="Adjust filters or create a new task." />
      ) : view === "kanban" ? (
        /* Kanban — horizontal scroll layout */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            { key: "todo", label: "Todo" },
            { key: "in_progress", label: "In Progress" },
            { key: "done", label: "Done" }
          ].map((column) => {
            const config = statusConfig[column.key];
            return (
              <div
                key={column.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropColumn(column.key)}
                className="min-w-[300px] flex-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
              >
                {/* Column header with gradient accent */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${config.headerBg}`} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{config.label}</h3>
                    <p className="text-xs text-slate-400">{tasksByStatus[column.key].length} task{tasksByStatus[column.key].length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
                  {tasksByStatus[column.key].map((task) => {
                    const prio = priorityConfig[task.priority] || priorityConfig.medium;
                    return (
                      <motion.div
                        key={task._id}
                        layout
                        variants={cardVariants}
                        whileHover={{ y: -3, scale: 1.02 }}
                        draggable
                        onDragStart={(e) => setDragTask(task)}
                        className="group cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                          <GripVertical size={14} className="shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <p className="mb-3 text-xs text-slate-500 line-clamp-2">{task.description || "No description"}</p>

                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${prio.color}`}>
                            <Flag size={10} /> {prio.label}
                          </span>
                        </div>

                        <div className="mb-3 space-y-1 text-xs text-slate-500">
                          <p className="inline-flex items-center gap-1.5"><UserCircle2 size={12} /> {task.assignedTo?.name || "Unassigned"}</p>
                          <p className="inline-flex items-center gap-1.5"><CalendarDays size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</p>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => updateStatus(task._id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400"
                        >
                          <option value="todo">Todo</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table view — with hover rows and striped effect */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b-2 border-slate-100">
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">Task</th>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Assignee</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => {
                const prio = priorityConfig[task.priority] || priorityConfig.medium;
                return (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 120 }}
                    className={`border-b border-slate-50 transition hover:bg-violet-50/30 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{task.title}</td>
                    <td className="px-5 py-3.5 text-slate-600">{task.project?.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{task.assignedTo?.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${prio.color}`}>
                        <Flag size={10} /> {prio.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400"
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};

export default TasksPage;
