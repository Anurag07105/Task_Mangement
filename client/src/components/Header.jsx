import { Bell, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AccountSettingsDrawer from "./AccountSettingsDrawer";

const roleBadgeClasses = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  member: "bg-blue-100 text-blue-700 border-blue-200"
};

const Header = ({ pageTitle }) => {
  const { user } = useAuth();
  const welcome = user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome";
  const role = user?.role || "member";
  const [showSettings, setShowSettings] = useState(false);
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (!user?._id) return;
    const saved = localStorage.getItem(`ttm_designation_${user._id}`);
    if (saved) setDesignation(saved);
  }, [user?._id]);

  const saveDesignation = () => {
    if (!user?._id) return;
    localStorage.setItem(`ttm_designation_${user._id}`, designation.trim());
    setShowSettings(false);
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-3 z-40 mb-6 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 inline-flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-semibold text-white shadow-sm">
              T
            </span>
            <span className="text-xs font-medium text-slate-500">Team Task Manager</span>
          </div>
          <p className="text-xs font-medium text-slate-500">{welcome}</p>
          <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="hidden rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:scale-105 hover:bg-slate-200 hover:text-brand-600 md:block"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:scale-105 hover:bg-slate-200 hover:text-brand-600"
          >
            <Bell size={16} />
          </button>
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                roleBadgeClasses[role]
              }`}
            >
              {role}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-sm font-bold text-white shadow-md transition hover:scale-105"
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="hidden rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:scale-105 hover:bg-slate-200 hover:text-brand-600 md:block"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <AccountSettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        designation={designation}
        onDesignationChange={setDesignation}
        onSave={saveDesignation}
      />
    </motion.header>
  );
};

export default Header;
