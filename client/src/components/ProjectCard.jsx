import { Calendar, CheckCircle2, Users } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, taskCount, progress, deadline, onStatusChange, canEditStatus }) => {
  const members = project.members || [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition"
    >
      <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500">
        {project.description || "No description added yet."}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-1">
          <Users size={13} />
          {members.length} members
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={13} />
          {taskCount} tasks
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={13} />
          {deadline}
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold text-slate-500">Project Status</p>
        <select
          value={project.status || "planning"}
          onChange={(e) => onStatusChange?.(project._id, e.target.value)}
          disabled={!canEditStatus}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium capitalize text-slate-700 disabled:opacity-60 transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex -space-x-2">
        {members.slice(0, 5).map((member) => (
          <div
            key={member._id}
            title={member.name}
            className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700 shadow-sm"
          >
            {member.name?.[0]?.toUpperCase() || "U"}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
