import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Filter, Plus, Search, FolderOpen, Users, CheckCircle2, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import EmptyState from "../components/EmptyState";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardAnim = {
  hidden: { opacity: 0, y: 25, rotateX: 8 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 100, damping: 14 } }
};

const statusBadge = {
  planning: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-violet-50 text-violet-700 border-violet-200"
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = async () => {
    const [projectRes, taskRes] = await Promise.all([
      axiosClient.get("/projects"),
      axiosClient.get("/tasks")
    ]);
    setProjects(projectRes.data.projects);
    setTasks(taskRes.data.tasks || []);
  };

  const loadUsers = async () => {
    if (user?.role !== "admin") return;
    const { data } = await axiosClient.get("/auth/users");
    setMembers(data.users || []);
  };

  useEffect(() => {
    loadProjects();
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user?.role]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/projects", form);
      toast.success("Project created.");
      setForm({ name: "", description: "" });
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create project.");
    }
  };

  const addMember = async () => {
    if (!selectedProject || !selectedMember) return;
    try {
      await axiosClient.post(`/projects/${selectedProject}/members`, { memberId: selectedMember });
      toast.success("Member added.");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member.");
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axiosClient.patch(`/projects/${projectId}/status`, { status });
      toast.success("Project status updated.");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project status.");
    }
  };

  const getProjectProgress = (project, projectTasks) => {
    const completed = projectTasks.filter((task) => task.status === "done").length;
    const fromTasks = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    const statusBase = { planning: 20, active: 60, completed: 100 };
    return Math.max(fromTasks, statusBase[project.status] ?? 0);
  };

  const filteredProjects = projects
    .filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
    .filter((project) =>
      memberFilter === "mine" ? project.members?.some((member) => member._id === user?._id) : true
    )
    .filter((project) => (statusFilter === "all" ? true : project.status === statusFilter));

  return (
    <AppLayout pageTitle="Projects">
      {/* Top bar: search left, filters + create right */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={16} />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
          >
            <option value="all">All projects</option>
            <option value="mine">My projects</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
          >
            <option value="all">All status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {user?.role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setShowCreate((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition"
            >
              <Plus size={15} />
              New Project
            </motion.button>
          )}
        </div>
      </div>

      {/* Create project panel */}
      <AnimatePresence>
        {user?.role === "admin" && showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Create Project</h2>
              <form className="grid gap-3 lg:grid-cols-3" onSubmit={createProject}>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                  placeholder="Project name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <button className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-violet-700">Create</button>
              </form>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <select
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                <button onClick={addMember} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-indigo-700">
                  Add Member
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="mb-4 flex items-center gap-2">
        <Filter size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Project list — horizontal card orientation */}
      {filteredProjects.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Create a new project to get started." />
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((task) => task.project?._id === project._id);
            const progress = getProjectProgress(project, projectTasks);
            const projectMembers = project.members || [];
            const deadlines = projectTasks
              .filter((task) => task.dueDate)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            const deadline = deadlines[0]
              ? new Date(deadlines[0].dueDate).toLocaleDateString()
              : "N/A";

            return (
              <motion.div
                key={project._id}
                variants={cardAnim}
                whileHover={{ x: 4, scale: 1.005 }}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: icon + info */}
                <div className="flex items-start gap-4 sm:items-center">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                    <FolderOpen size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{project.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{project.description || "No description"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1"><Users size={12} /> {projectMembers.length}</span>
                      <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> {projectTasks.length} tasks</span>
                      <span className="inline-flex items-center gap-1"><Calendar size={12} /> {deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Right: status + progress + members */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {/* Status select */}
                  <select
                    value={project.status || "planning"}
                    onChange={(e) => updateProjectStatus(project._id, e.target.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize outline-none transition ${statusBadge[project.status] || statusBadge.planning}`}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Progress bar */}
                  <div className="w-32">
                    <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Avatar stack */}
                  <div className="flex -space-x-2">
                    {projectMembers.slice(0, 4).map((member) => (
                      <div
                        key={member._id}
                        title={member.name}
                        className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700 shadow-sm"
                      >
                        {member.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    ))}
                    {projectMembers.length > 4 && (
                      <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-violet-100 text-xs font-bold text-violet-700">
                        +{projectMembers.length - 4}
                      </div>
                    )}
                  </div>

                  <ChevronRight size={16} className="hidden text-slate-300 transition group-hover:text-violet-500 sm:block" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AppLayout>
  );
};

export default ProjectsPage;
