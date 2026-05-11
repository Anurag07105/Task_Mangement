import { motion } from "framer-motion";

const DashboardCard = ({ icon: Icon, label, value, colorClass }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-2xl bg-gradient-to-br p-[1px] ${colorClass} shadow-lg shadow-slate-200/50`}
    >
      <div className="rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
            <Icon size={16} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
