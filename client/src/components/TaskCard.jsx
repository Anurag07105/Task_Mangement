import { CalendarDays, Flag, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  todo: "bg-slate-100 text-slate-700 border border-slate-200",
  in_progress: "bg-amber-100 text-amber-700 border border-amber-200",
  done: "bg-emerald-100 text-emerald-700 border border-emerald-200"
};

const priorityColors = {
  low: "text-sky-500 font-medium",
  medium: "text-amber-500 font-medium",
  high: "text-rose-500 font-medium"
};

const TaskCard = ({ task, onStatusChange, draggable, onDragStart, compact = false }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/50 hover:shadow-md transition"
    >
      <h4 className="line-clamp-1 font-bold text-slate-900">{task.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">{task.description || "No description"}</p>

      <div className={`mt-3 flex ${compact ? "flex-col gap-2" : "items-center justify-between gap-2"}`}>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[task.status]}`}>
          {task.status.replace("_", " ")}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
          <Flag size={12} />
          {task.priority}
        </span>
      </div>

      <div className="mt-3 grid gap-1 text-xs font-medium text-slate-500">
        <p className="inline-flex items-center gap-1">
          <UserCircle2 size={12} />
          {task.assignedTo?.name || "Unassigned"}
        </p>
        <p className="inline-flex items-center gap-1">
          <CalendarDays size={12} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </p>
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </motion.div>
  );
};

export default TaskCard;
