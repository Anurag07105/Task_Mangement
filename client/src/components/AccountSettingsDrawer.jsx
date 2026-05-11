import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Mail, Shield, User, X } from "lucide-react";

const roleBadgeClasses = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  member: "bg-blue-100 text-blue-700 border-blue-200"
};

const AccountSettingsDrawer = ({
  isOpen,
  onClose,
  user,
  designation,
  onDesignationChange,
  onSave
}) => {
  const role = user?.role || "member";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/60"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Account Settings</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-lg font-bold text-white shadow-md">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="space-y-2 text-sm">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <User size={14} />
                    {user?.name || "Unknown user"}
                  </p>
                  <p className="inline-flex items-center gap-2 text-slate-500">
                    <Mail size={14} />
                    {user?.email || "No email"}
                  </p>
                  <p className="inline-flex items-center gap-2 text-slate-600">
                    <Shield size={14} />
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                        roleBadgeClasses[role]
                      }`}
                    >
                      {role}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <BriefcaseBusiness size={13} />
                  Designation
                </label>
                <input
                  value={designation}
                  onChange={(e) => onDesignationChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  placeholder="e.g. Frontend Developer"
                />
                <p className="mt-2 text-xs font-medium text-slate-400">
                  This is stored locally for your profile display.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onSave}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              Save Settings
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountSettingsDrawer;
